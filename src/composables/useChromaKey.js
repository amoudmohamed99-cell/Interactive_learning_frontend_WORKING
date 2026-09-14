import { ref, onUnmounted } from 'vue'

/**
 * Composable for real-time chroma key (green screen removal).
 * Takes a video element's stream, removes green pixels, outputs to a canvas.
 */
export function useChromaKey() {
  const canvasRef = ref(null)
  let animFrameId = null
  let videoEl = null
  let ctx = null
  let isRunning = false

  /**
   * Start chroma key processing.
   * @param {HTMLVideoElement} video - The source video element (from Simli)
   * @param {HTMLCanvasElement} canvas - The output canvas element
   */
  const startChromaKey = (video, canvas) => {
    if (isRunning) return
    videoEl = video
    canvasRef.value = canvas
    ctx = canvas.getContext('2d', { willReadFrequently: true })
    isRunning = true
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

    // Only process if video has data
    if (videoEl.readyState >= 2) {
      ctx.drawImage(videoEl, 0, 0, w, h)
      const frame = ctx.getImageData(0, 0, w, h)
      const data = frame.data

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]

        // Green screen detection:
        // Pixel is "green" if green channel is dominant
        if (g > 80 && g > r * 1.3 && g > b * 1.3) {
          // Make transparent
          data[i + 3] = 0
        }
        // Edge softening: partial transparency for near-green pixels
        else if (g > 60 && g > r * 1.1 && g > b * 1.1) {
          data[i + 3] = Math.floor(data[i + 3] * 0.5)
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
  }

  onUnmounted(() => {
    stopChromaKey()
  })

  return { canvasRef, startChromaKey, stopChromaKey }
}
