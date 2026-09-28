import { ref, onUnmounted } from 'vue'

/**
 * Advanced Chroma Key v2 — Production-quality green screen removal.
 *
 * Improvements over v1:
 * ─────────────────────
 * 1. Color-distance keying in YCbCr space (industry standard for chroma key)
 * 2. Two-pass processing: key → alpha mask refinement (edge blur)
 * 3. Proper despill: clamps green channel to max(R,B) — preserves natural color
 * 4. Alpha mask smoothing: 3×3 box blur on alpha for feathered edges
 * 5. Temporal smoothing: blends alpha with previous frame to reduce flicker
 */
export function useChromaKey() {
  const canvasRef = ref(null)
  let animFrameId = null
  let videoEl = null
  let ctx = null
  let isRunning = false
  let prevAlpha = null  // For temporal smoothing

  // ═══ Tunable Parameters ═══
  const config = {
    // Reference green screen color (default: standard chroma green)
    keyColor: { r: 0, g: 177, b: 64 },

    // How far (in YCbCr distance) a pixel can be from keyColor and still be keyed
    // Lower = stricter (keeps more whites). Higher = catches more greens.
    tolerance: 0.32,

    // Soft edge width beyond the tolerance boundary
    softness: 0.12,

    // Despill: how much green tint to remove from non-keyed pixels (0-1)
    spillRemoval: 0.90,

    // Alpha mask blur passes (more = smoother edges, but slower)
    edgeBlurPasses: 2,

    // Temporal blend: mix with previous frame's alpha to reduce flicker (0-1)
    // 0 = no blending, 0.3 = slight smoothing, 0.5 = heavy smoothing
    temporalBlend: 0.25,
  }

  // ═══ Color Space Conversion ═══

  /**
   * RGB → YCbCr (ITU-R BT.601)
   * Y  = luminance (brightness)
   * Cb = blue-difference chroma
   * Cr = red-difference chroma
   * The green screen lives in a tight cluster in CbCr space,
   * making it easy to separate from white/gray objects.
   */
  const rgbToYCbCr = (r, g, b) => {
    const y  =  0.299 * r + 0.587 * g + 0.114 * b
    const cb = -0.169 * r - 0.331 * g + 0.500 * b + 128
    const cr =  0.500 * r - 0.419 * g - 0.081 * b + 128
    return [y, cb, cr]
  }

  // Pre-compute the key color in YCbCr
  let keyCb, keyCr
  const updateKeyColor = () => {
    const [, cb, cr] = rgbToYCbCr(config.keyColor.r, config.keyColor.g, config.keyColor.b)
    keyCb = cb
    keyCr = cr
  }
  updateKeyColor()

  /**
   * Calculate chromatic distance from the key color in CbCr space.
   * Ignores luminance (Y) so shadows/highlights on the green screen
   * are still detected — but white objects with low saturation are NOT.
   */
  const chromaDistance = (r, g, b) => {
    const [, cb, cr] = rgbToYCbCr(r, g, b)
    const dCb = cb - keyCb
    const dCr = cr - keyCr
    // Normalize to 0-1 range (max possible distance ≈ 180)
    return Math.sqrt(dCb * dCb + dCr * dCr) / 180
  }

  /**
   * 3×3 box blur on the alpha channel only.
   * Creates smooth, feathered edges instead of jagged cuts.
   */
  const blurAlpha = (data, w, h) => {
    // Work on a copy to avoid read-write conflicts
    const alphaCopy = new Uint8Array(w * h)
    for (let i = 0; i < w * h; i++) {
      alphaCopy[i] = data[i * 4 + 3]
    }

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = y * w + x
        // 3×3 weighted average (center pixel gets 4x weight for subtle blur)
        const sum =
          alphaCopy[(y-1)*w + (x-1)] +
          alphaCopy[(y-1)*w + x]     * 2 +
          alphaCopy[(y-1)*w + (x+1)] +
          alphaCopy[y*w + (x-1)]     * 2 +
          alphaCopy[y*w + x]         * 4 +
          alphaCopy[y*w + (x+1)]     * 2 +
          alphaCopy[(y+1)*w + (x-1)] +
          alphaCopy[(y+1)*w + x]     * 2 +
          alphaCopy[(y+1)*w + (x+1)]
        
        data[idx * 4 + 3] = Math.round(sum / 16)
      }
    }
  }

  /**
   * Despill: Remove green color cast from non-keyed pixels.
   * Uses the industry-standard method: clamp G to max(R, B).
   * This preserves natural skin tones and white fabric.
   */
  const despill = (data, i, strength) => {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    
    // The maximum "natural" green level is approximately max(R, B)
    // Anything above that is green spill from the screen
    const maxRB = Math.max(r, b)
    if (g > maxRB) {
      // Blend between original G and clamped G based on strength
      data[i + 1] = Math.round(g - (g - maxRB) * strength)
    }
  }

  // ═══ Main Processing ═══

  const startChromaKey = (video, canvas) => {
    if (isRunning) return
    videoEl = video
    canvasRef.value = canvas
    ctx = canvas.getContext('2d', { willReadFrequently: true })
    isRunning = true
    updateKeyColor()
    processFrame()
  }

  const processFrame = () => {
    if (!isRunning || !videoEl || !ctx) return

    const w = videoEl.videoWidth || 512
    const h = videoEl.videoHeight || 512

    if (canvasRef.value) {
      canvasRef.value.width = w
      canvasRef.value.height = h
    }

    if (videoEl.readyState >= 2) {
      ctx.drawImage(videoEl, 0, 0, w, h)
      const frame = ctx.getImageData(0, 0, w, h)
      const data = frame.data
      const totalPixels = w * h

      // ──── Pass 1: Compute alpha mask ────
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]

        const dist = chromaDistance(r, g, b)

        if (dist < config.tolerance) {
          // ═══ Core green — fully transparent ═══
          data[i + 3] = 0
        }
        else if (dist < config.tolerance + config.softness) {
          // ═══ Soft edge — smooth gradient ═══
          const t = (dist - config.tolerance) / config.softness
          // Smooth S-curve: sin-based easing for natural falloff
          const alpha = Math.round(255 * (0.5 - 0.5 * Math.cos(t * Math.PI)))
          data[i + 3] = alpha

          // Despill edge pixels (they often have green tint)
          despill(data, i, config.spillRemoval)
        }
        else {
          // ═══ Not green — keep but despill if needed ═══
          data[i + 3] = 255
          despill(data, i, config.spillRemoval * 0.5)
        }
      }

      // ──── Pass 2: Smooth the alpha mask edges ────
      for (let pass = 0; pass < config.edgeBlurPasses; pass++) {
        blurAlpha(data, w, h)
      }

      // ──── Pass 3: Temporal smoothing (reduce flicker) ────
      if (config.temporalBlend > 0 && prevAlpha && prevAlpha.length === totalPixels) {
        const blend = config.temporalBlend
        const invBlend = 1 - blend
        for (let p = 0; p < totalPixels; p++) {
          const current = data[p * 4 + 3]
          const prev = prevAlpha[p]
          data[p * 4 + 3] = Math.round(current * invBlend + prev * blend)
          prevAlpha[p] = data[p * 4 + 3]
        }
      } else {
        // Initialize temporal buffer
        prevAlpha = new Uint8Array(totalPixels)
        for (let p = 0; p < totalPixels; p++) {
          prevAlpha[p] = data[p * 4 + 3]
        }
      }

      ctx.putImageData(frame, 0, 0)
    }

    animFrameId = requestAnimationFrame(processFrame)
  }

  const stopChromaKey = () => {
    isRunning = false
    if (animFrameId) {
      cancelAnimationFrame(animFrameId)
      animFrameId = null
    }
    videoEl = null
    ctx = null
    prevAlpha = null
  }

  onUnmounted(() => {
    stopChromaKey()
  })

  return { canvasRef, startChromaKey, stopChromaKey, config, updateKeyColor }
}
