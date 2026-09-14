import { ref, onUnmounted } from 'vue'
import { SimliClient } from 'simli-client'
import { getSimliToken, getSimliIce } from '../api'

/**
 * Composable to manage Simli avatar connection.
 * Usage:
 *   const { videoRef, audioRef, isConnected, isAvatarSpeaking, startAvatar, stopAvatar, sendAudio } = useSimli()
 */
export function useSimli() {
  const videoRef = ref(null)
  const audioRef = ref(null)
  const isConnected = ref(false)
  const isAvatarSpeaking = ref(false)
  const error = ref(null)

  let simliClient = null

  const startAvatar = async () => {
    try {
      error.value = null

      // 1. Get session token from our backend (keeps API key safe)
      const tokenData = await getSimliToken()
      if (!tokenData.session_token) {
        error.value = 'Failed to get Simli token'
        console.error('Simli: No session token received')
        return false
      }

      console.log('Simli: Got session token, initializing...')

      // 2. Wait for DOM refs
      if (!videoRef.value || !audioRef.value) {
        error.value = 'Video/Audio elements not ready'
        return false
      }

      // 3. Get ICE servers via backend proxy (API key protected)
      let iceServers = null
      try {
        iceServers = await getSimliIce()
        console.log('Simli: Got ICE servers', iceServers)
      } catch (e) {
        console.warn('Simli: Could not get ICE servers', e.message)
      }

      // 4. Initialize SimliClient in P2P mode (lower latency, direct connection)
      simliClient = new SimliClient(
        tokenData.session_token,
        videoRef.value,
        audioRef.value,
        iceServers,  // ICE servers for NAT traversal
        undefined,   // default log level
        'p2p',       // P2P mode - avoids LiveKit WebSocket issues
      )

      // 5. Listen for events
      simliClient.on('start', () => {
        console.log('Simli: Connected! Avatar is live.')
        isConnected.value = true
      })

      simliClient.on('speaking', () => {
        isAvatarSpeaking.value = true
      })

      simliClient.on('silent', () => {
        isAvatarSpeaking.value = false
      })

      simliClient.on('error', (err) => {
        console.error('Simli: Connection error', err)
        error.value = 'Avatar connection error'
        isConnected.value = false
      })

      simliClient.on('stop', () => {
        console.log('Simli: Connection closed')
        isConnected.value = false
        isAvatarSpeaking.value = false
      })

      simliClient.on('startup_error', (msg) => {
        console.error('Simli: Startup error:', msg)
        error.value = `Avatar startup failed: ${msg}`
        isConnected.value = false
      })

      // 5. Start the connection
      await simliClient.start()
      return true

    } catch (e) {
      console.error('Simli: Failed to start', e)
      error.value = e.message || 'Failed to start avatar'
      return false
    }
  }

  const stopAvatar = async () => {
    if (simliClient) {
      try { await simliClient.stop() } catch (e) { /* ignore */ }
      simliClient = null
    }
    isConnected.value = false
    isAvatarSpeaking.value = false
  }

  /**
   * Send audio data to Simli for lip sync.
   * Audio must be PCM16 format, 16KHz sample rate.
   */
  const sendAudio = (audioData) => {
    if (simliClient && isConnected.value) {
      simliClient.sendAudioData(audioData)
    }
  }

  /**
   * Listen to a MediaStreamTrack (e.g., from ElevenLabs TTS output)
   * and automatically send audio to Simli.
   */
  const listenToTrack = (track) => {
    if (simliClient && isConnected.value) {
      simliClient.listenToMediastreamTrack(track)
    }
  }

  /**
   * Clear avatar's audio buffer (stop talking).
   */
  const clearBuffer = () => {
    if (simliClient) {
      simliClient.ClearBuffer()
    }
  }

  onUnmounted(() => {
    stopAvatar()
  })

  return {
    videoRef,
    audioRef,
    isConnected,
    isAvatarSpeaking,
    error,
    startAvatar,
    stopAvatar,
    sendAudio,
    listenToTrack,
    clearBuffer,
  }
}
