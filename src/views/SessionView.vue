<template>
  <div class="session-page">
    <!-- ═══ Scene: BG + Avatar ═══ -->
    <div class="scene-viewport" :style="{ backgroundImage: `url(${currentBg})` }">
      <div class="bg-overlay"></div>
      <video ref="simliVideoRef" autoplay playsinline class="hidden-video" />
      <audio ref="simliAudioRef" autoplay />
      <canvas ref="chromaCanvas" class="ahmad-canvas" v-show="simliConnected && !showWelcome"></canvas>
    </div>

    <!-- ═══ Welcome / Instructions Overlay (while Simli loads) ═══ -->
    <transition name="fade">
      <div v-if="showWelcome" class="welcome-overlay">
        <div class="welcome-card">

          <!-- Card Header -->
          <div class="wc-header">
            <div class="wc-icon-wrap">
              <span class="wc-icon">💬</span>
            </div>
            <span class="wc-session-tag">
              SESSION {{ scenarioNumber }}
            </span>
          </div>

          <!-- Title -->
          <h2 class="wc-title">{{ scenarioTitle }}</h2>

          <!-- Description -->
          <p class="wc-desc">{{ scenarioContext }}</p>

          <!-- Divider -->
          <div class="wc-divider"></div>

          <!-- Learning Goals -->
          <div class="wc-goals">
            <h4 class="wc-goals-title">
              <span class="wc-goals-icon">🎯</span>
              Learning Goals
            </h4>
            <div
              v-for="(goal, i) in learningGoals"
              :key="i"
              class="wc-goal-item"
              :style="{ animationDelay: `${0.3 + i * 0.25}s` }"
            >
              <span class="wc-goal-check">✓</span>
              {{ goal }}
            </div>
          </div>

          <!-- Quote -->
          <div class="wc-quote">
            <span class="wc-quote-mark">"</span>
            <div>
              <p>{{ motivationalQuote }}</p>
              <span class="wc-quote-author">— Ahmad</span>
            </div>
          </div>

          <!-- Action Button -->
          <button
            @click="dismissWelcome"
            class="wc-btn"
            :class="{
              ready: simliConnected || simliTimedOut,
              loading: !simliConnected && !simliTimedOut
            }"
            :disabled="!simliConnected && !simliTimedOut"
          >
            <span v-if="simliConnected || simliTimedOut" class="wc-btn-content">
              Start Session
              <span class="wc-btn-arrow">→</span>
            </span>
            <span v-else class="wc-btn-content wc-btn-loading">
              <span class="wc-spinner"></span>
              Getting your session ready...
            </span>
          </button>

          <!-- Footer hint -->
          <p v-if="simliConnected || simliTimedOut" class="wc-footer-hint">
            Everything is set. Let's go! 🚀
          </p>
          <p v-else class="wc-footer-hint">
            This will only take a moment
          </p>

        </div>
      </div>
    </transition>


    <!-- ═══ Top Header Bar ═══ -->
    <header class="top-bar">
      <div class="tb-left">
        <span class="app-logo">💬 SpeakBetter</span>
        <span class="app-tagline">Real Conversations. A Brighter You.</span>
      </div>
      <div class="tb-center">
        <span class="student-badge">👤 {{ studentCode }}</span>
        <span class="phase-badge">📋 {{ phaseLabel }}</span>
      </div>
      <div class="tb-right">
        <button class="scenario-toggle-btn" @click="showMobileScenario = !showMobileScenario">
          {{ showMobileScenario ? '✕ إغلاق' : '📋 السيناريو' }}
        </button>
        <span class="timer-display" :class="{ warning: remainingTotal < 300 }">⏱ {{ formatTime(remainingTotal) }}</span>
        <button class="end-btn" @click="handleEnd">🔴 End Session</button>
      </div>
    </header>

    <!-- ═══ Phase Dots ═══ -->
    <div class="phase-dots-bar">
      <div v-for="p in phases" :key="p.key" class="pdot" :class="{ current: p.is_current, done: p.is_done }">
        <span class="pdot-label">{{ p.label }}</span>
      </div>
    </div>

    <!-- ═══ Main Content ═══ -->
    <div class="main-area">

      <!-- LEFT Panel: Chat + Actions -->
      <div class="left-panel">
        <!-- Ahmad's message bubble -->
        <div v-if="ahmadLastMessage" class="chat-bubble">
          <div class="cb-header">
            <span class="cb-name">Ahmad</span>
            <span v-if="ahmadSpeaking" class="cb-speaking">🔊</span>
          </div>
          <p class="cb-text">{{ ahmadLastMessage }}</p>
        </div>

        <!-- Vocab list (vocab phase) -->
        <div v-if="currentPhase === 'vocab'" class="vocab-list">
          <h4>📖 Key Vocabulary</h4>
          <div v-for="item in vocabWithSentences" :key="item.word" class="vocab-item" @click="speakVocab(item.sentence || item.word)">
            <span class="vi-word">{{ item.word }}</span>
            <span class="vi-speaker">🔊</span>
          </div>
        </div>

        <!-- Feedback (feedback phase) -->
        <div v-if="currentPhase === 'feedback'" class="feedback-box">
          <h4>📊 Performance</h4>
          <div class="fb-stats-row">
            <div class="fb-s green">{{ performanceStats.correct }} ✅</div>
            <div class="fb-s yellow">{{ performanceStats.needsWork }} ⚠️</div>
            <div class="fb-s blue">{{ performanceStats.totalTurns }} 📝</div>
          </div>
          <div v-if="performanceStats.strength" class="fb-note strength">💪 {{ performanceStats.strength }}</div>
          <div v-if="performanceStats.improvement" class="fb-note improve">🎯 {{ performanceStats.improvement }}</div>
        </div>

        <!-- Phase action buttons -->
        <div class="phase-actions">
          <!-- No button for intro: auto-advances to vocab after student says their name -->
          <button v-if="currentPhase === 'vocab'" class="action-btn" @click="doAdvancePhase">🎤 ابدأ المحادثة! (Start Conversation) →</button>
          <button v-if="currentPhase === 'feedback'" class="action-btn" @click="doAdvancePhase">📝 الملخص (Summary) →</button>
          <button v-if="currentPhase === 'closing'" class="action-btn finish" @click="finishSession">✅ إنهاء الجلسة (Complete Session)</button>
        </div>
      </div>

      <!-- CENTER: spacer for layout -->
      <div class="center-panel"></div>

      <!-- RIGHT Panel: Scenario Card -->
      <div class="right-panel" :class="{ 'mobile-open': showMobileScenario }">
        <div class="scenario-card">
          <div class="mobile-scenario-close" @click="showMobileScenario = false">✕ إغلاق</div>
          <span class="sc-tag">Today's Scenario</span>
          <h2 class="sc-title">{{ scenarioTitle }}</h2>
          <p class="sc-desc">{{ scenarioContext }}</p>
          <div class="sc-goals">
            <h4>🎯 Learning Goals</h4>
            <div v-for="(goal, i) in learningGoals" :key="i" class="sc-goal-item">✅ {{ goal }}</div>
          </div>
          <div class="quote-box">
            <p>"{{ motivationalQuote }}"</p>
            <span>— Ahmad</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Adaptive Feedback Card (conversation) -->
    <transition name="slide-up">
      <div v-if="feedbackCard && currentPhase === 'conversation'" class="feedback-card" :class="'level-' + feedbackCard.level">
        <div class="fc-header">
          <span class="fc-title">{{ feedbackCard.title }}</span>
          <div class="attempt-dots">
            <span v-for="i in 3" :key="i" class="dot" :class="{ used: i <= feedbackCard.attempt }"></span>
          </div>
        </div>
        <p class="fc-text">{{ feedbackCard.text }}</p>
        <button v-if="feedbackCard.level === 3" class="listen-btn" @click="speakVocab(feedbackCard.text)">🔊 Listen</button>
      </div>
    </transition>

    <!-- ═══ Bottom Control Bar ═══ -->
    <footer class="control-bar">
      <div class="cb-left-area"></div>

      <div v-if="isRecording" class="waveform">
        <div v-for="i in 6" :key="'l'+i" class="wave-bar" :style="{ animationDelay: (i * 0.06) + 's' }"></div>
      </div>

      <div class="mic-area">
        <div class="mic-ring" :class="micRingClass"></div>
        <button class="mic-btn" :class="{ active: isRecording, disabled: !canRecord }"
          @mousedown="startRecording" @mouseup="stopRecording"
          @touchstart.prevent="startRecording" @touchend.prevent="stopRecording" @touchcancel.prevent="stopRecording"
          :disabled="!canRecord">🎤</button>
        <span class="mic-status">{{ statusText }}</span>
      </div>

      <div v-if="isRecording" class="waveform">
        <div v-for="i in 6" :key="'r'+i" class="wave-bar" :style="{ animationDelay: (i * 0.06) + 's' }"></div>
      </div>

      <div class="cb-right-area">
        <span class="phase-dots-mini">
          <span v-for="p in phases" :key="'m'+p.key" class="pm" :class="{ current: p.is_current, done: p.is_done }"></span>
        </span>
      </div>
    </footer>

    <!-- Typing input -->
    <div v-if="showTypingInput && currentPhase === 'conversation'" class="typing-overlay">
      <input v-model="typedMessage" placeholder="Type your message in English..." @keyup.enter="sendTyped" class="typing-input" />
      <button @click="sendTyped" class="send-typed-btn">Send →</button>
      <button @click="showTypingInput = false" class="close-typing">✕</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { startSession, speak, endSession, advancePhase as apiAdvancePhase, API_URL } from '../api'
import { useSimli } from '../composables/useSimli'
import { useChromaKey } from '../composables/useChromaKey'

const route = useRoute()
const router = useRouter()
const sessionId = route.params.id

// State
const studentCode = ref(localStorage.getItem('student_code') || 'STD-???')
const scenarioTitle = ref('')
const communicativeFunction = ref('')
const scenarioContext = ref('')
const completionCriteria = ref('')
const vocabulary = ref([])
const scenarioNumber = ref(1)
const status = ref('ready')
const ahmadSpeaking = ref(false)
const isRecording = ref(false)
const feedbackCard = ref(null)
const ahmadLastMessage = ref('')
const showTypingInput = ref(false)
const typedMessage = ref('')
const showMobileScenario = ref(false)
let currentAudio = null // Track current audio to prevent overlap

// Simli Avatar Composable
const { videoRef: simliVideoRef, audioRef: simliAudioRef, isConnected: simliConnected, isAvatarSpeaking: simliSpeaking, startAvatar, stopAvatar, sendAudio: simliSendAudio } = useSimli()
const simliReady = ref(false)
const simliTimedOut = ref(false)

// Chroma Key
const chromaCanvas = ref(null)
const { startChromaKey, stopChromaKey } = useChromaKey()

// Welcome overlay — shown while Simli loads and user reads instructions
const showWelcome = ref(true)
let pendingIntro = null // { msg, audio, format }

const dismissWelcome = () => {
  showWelcome.value = false
  // Play greeting as soon as user enters session
  if (pendingIntro) {
    const { msg, audio, format } = pendingIntro
    pendingIntro = null
    // Small delay for fade transition
    setTimeout(() => {
      speakAloud(msg, audio, format)
    }, 300)
  }

  // Auto-advance: intro → vocab after Ahmad finishes greeting
  // Per design doc: intro is just greeting/overview, then vocab shows words
  const waitForGreetingThenAdvance = () => {
    if (ahmadSpeaking.value) {
      setTimeout(waitForGreetingThenAdvance, 500)
    } else {
      // Ahmad finished greeting — wait 2s then advance to vocab
      setTimeout(() => {
        if (currentPhase.value === 'intro') {
          doAdvancePhase()
        }
      }, 2000)
    }
  }
  // Start checking after 3s (give greeting time to begin playing)
  setTimeout(waitForGreetingThenAdvance, 3000)
}

// When Simli connects, start chroma key processing
watch(simliConnected, (connected) => {
  if (connected && simliVideoRef.value && chromaCanvas.value) {
    nextTick(() => {
      startChromaKey(simliVideoRef.value, chromaCanvas.value)
    })
  } else {
    stopChromaKey()
  }
})

// Performance
const performanceStats = ref({ correct: 0, needsWork: 0, totalTurns: 0, strength: '', improvement: '' })

// Phase & Timer
const currentPhase = ref('intro')
const phases = ref([])
const remainingTotal = ref(40 * 60)
const remainingInPhase = ref(5 * 60)
let timerInterval = null

// Background: always use the scenario background
const currentBg = computed(() => {
  return `/backgrounds/sc0${scenarioNumber.value}.jpg`
})

const phaseLabel = computed(() => {
  const labels = { intro: 'التهيئة', vocab: 'المدخل اللغوي', conversation: 'المحادثة الموجهة', feedback: 'التغذية الراجعة', closing: 'الخلاصة والتأمل' }
  return labels[currentPhase.value] || currentPhase.value
})

const canRecord = computed(() => {
  return !ahmadSpeaking.value && status.value !== 'processing' && (currentPhase.value === 'conversation' || currentPhase.value === 'intro')
})

const micRingClass = computed(() => {
  if (ahmadSpeaking.value) return 'ring-blue'
  if (isRecording.value) return 'ring-green'
  if (status.value === 'processing') return 'ring-yellow'
  return 'ring-idle'
})

const statusText = computed(() => {
  if (ahmadSpeaking.value) return '🔊 Ahmad is speaking...'
  if (isRecording.value) return '🎧 Ahmad is listening...'
  if (status.value === 'processing') return '🤔 Ahmad is thinking...'
  if (currentPhase.value === 'intro') return '🎤 Hold to speak'
  if (currentPhase.value === 'vocab') return '📖 Practice the words above'
  if (currentPhase.value === 'feedback') return '📊 Review your performance'
  if (currentPhase.value === 'closing') return '🎉 Well done!'
  return '🎤 Hold to speak'
})

// Learning goals per scenario
const scenarioGoals = {
  1: ['Introduce yourself', 'Ask and answer questions', 'Find common interests'],
  2: ['Describe daily routines', 'Talk about changes', 'Use time expressions'],
  3: ['Share hobbies', 'Express preferences', 'Give reasons'],
  4: ['Ask for information', 'Give directions', 'Confirm understanding'],
  5: ['Describe people', 'Describe places', 'Use adjectives'],
  6: ['Express opinions', 'Give reasons', 'Respond to views'],
  7: ['Give suggestions', 'Negotiate solutions', 'Handle objections'],
  8: ['Narrate past events', 'Use connectors', 'Explain causes'],
}
const learningGoals = computed(() => scenarioGoals[scenarioNumber.value] || scenarioGoals[1])

const quotes = {
  1: 'Good friends make a brighter world.',
  2: 'Every day is a chance to grow.',
  3: 'Your passions make you unique.',
  4: 'Knowledge is the key to every door.',
  5: 'Words paint the world around us.',
  6: 'Your voice matters.',
  7: 'Together, we find better solutions.',
  8: 'Every story teaches us something new.',
}
const motivationalQuote = computed(() => quotes[scenarioNumber.value] || quotes[1])

// Vocab
const vocabSentences = {
  'name': 'My name is Ahmad.', 'grade': 'I am in grade 10.', 'school': 'I go to a public school.',
  'live': 'I live in Abha.', 'from': 'I am from Saudi Arabia.', 'hobby': 'My hobby is reading books.',
  'free time': 'In my free time, I play football.', 'usually': 'I usually wake up at 6 AM.',
  'nice to meet you': 'Nice to meet you!', 'how about you': 'How about you?',
  'enjoy': 'I enjoy playing video games.', 'every day': 'I exercise every day.',
  'morning': 'I study in the morning.', 'evening': 'I relax in the evening.',
  'start': 'I start school at 7 AM.', 'finish': 'I finish at 2 PM.',
  'study': 'I study for two hours.', 'practice': 'I practice speaking English.',
  'good at': "I'm good at drawing.", 'prefer': 'I prefer tea to coffee.',
  'sports': 'I like sports.', 'reading': 'Reading is my favorite hobby.',
  'where': 'Where is the nearest park?', 'when': 'When does the bus arrive?',
  'turn left': 'Turn left at the traffic light.', 'go straight': 'Go straight for 100 meters.',
  'next to': 'The bank is next to the school.', 'excuse me': 'Excuse me, can you help me?',
  'opinion': 'In my opinion, sports are important.', 'agree': 'I agree with you.',
  'because': 'I like it because it is fun.', 'I think': 'I think you are right.',
  'should': 'You should study more.', 'suggest': 'I suggest we take a break.',
  'maybe': 'Maybe we can try tomorrow.', 'problem': 'The problem is time.',
  'yesterday': 'Yesterday, I visited my friend.', 'first': 'First, I woke up early.',
  'then': 'Then, I ate breakfast.', 'suddenly': 'Suddenly, it started raining.',
  'finally': 'Finally, I finished my homework.', 'happened': 'Something funny happened.',
}
const vocabWithSentences = computed(() => {
  return vocabulary.value.slice(0, 8).map(word => ({
    word,
    sentence: vocabSentences[word.toLowerCase()] || `I use "${word}" in conversation.`
  }))
})

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

const scenarioContexts = {
  1: 'You are meeting someone new. Talk about your name, hobbies, and interests.',
  2: 'Tell Ahmad about your daily routine and recent changes.',
  3: 'Share what you enjoy doing in your free time.',
  4: 'You need information about a place. Ask Ahmad questions.',
  5: 'Describe a person or place to Ahmad in detail.',
  6: 'Share your opinion and explain your preference.',
  7: 'Ahmad has a problem. Give him advice.',
  8: 'Tell Ahmad about something interesting that happened recently.',
}

// ═══ SPEECH RECOGNITION ═══
let recognition = null
const SR = window.SpeechRecognition || window.webkitSpeechRecognition
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

if (SR) {
  recognition = new SR()
  recognition.lang = 'en-US'
  recognition.continuous = !isMobile // continuous breaks on mobile
  recognition.interimResults = true
  recognition.onresult = (e) => {
    let finalText = ''
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) finalText += e.results[i][0].transcript
    }
    if (finalText) sendToAhmad(finalText, e.results[e.results.length - 1][0].confidence)
  }
  recognition.onerror = (e) => {
    console.warn('Speech recognition error:', e.error)
    // On mobile, auto-restart on 'no-speech' error if we were recording
    if (isMobile && e.error === 'no-speech' && isRecording.value) {
      try { recognition.start() } catch(err) {}
      return  // Don't reset state, keep recording
    }
    isRecording.value = false; status.value = 'ready'
  }
  recognition.onend = () => {
    // On mobile (continuous=false), restart if still recording
    if (isMobile && isRecording.value) {
      try { recognition.start() } catch(e) {}
    }
  }
}

// Pre-request mic permission on mobile so getUserMedia doesn't block during hold
let micPermissionGranted = false
if (isMobile) {
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    stream.getTracks().forEach(t => t.stop())  // Release immediately
    micPermissionGranted = true
  }).catch(() => {})
}

let recordingStarting = false  // Guard against race condition on mobile

const startRecording = async () => {
  if (!canRecord.value || recordingStarting) return
  recordingStarting = true

  // Request mic permission — but release the stream immediately!
  // On mobile, getUserMedia and SpeechRecognition CANNOT share the mic.
  // We only call getUserMedia to trigger the permission prompt if needed.
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    stream.getTracks().forEach(t => t.stop())  // Release mic immediately!
  } catch (e) {
    console.error('Mic permission denied:', e)
    alert('Please allow microphone access to continue')
    recordingStarting = false
    return
  }

  isRecording.value = true; status.value = 'listening'; feedbackCard.value = null
  recordingStarting = false
  try { recognition?.start() } catch(e) { console.warn('Recognition start failed:', e) }
}
const stopRecording = () => {
  // On mobile, if the recording hasn't actually started yet (getUserMedia still pending), ignore
  if (recordingStarting) return
  if (!isRecording.value) return
  isRecording.value = false
  try { recognition?.stop() } catch(e) {}
  if (status.value === 'listening') status.value = 'ready'
}

const toggleTyping = () => { showTypingInput.value = !showTypingInput.value }
const sendTyped = () => {
  if (typedMessage.value.trim() && currentPhase.value === 'conversation') {
    sendToAhmad(typedMessage.value.trim(), 1.0)
    typedMessage.value = ''
    showTypingInput.value = false
  }
}

// ═══ CONVERSATION ═══
const sendToAhmad = async (text, confidence) => {
  status.value = 'processing'; isRecording.value = false
  try { recognition?.stop() } catch(e) {}
  try {
    const { data } = await speak(sessionId, text, confidence)
    const r = data || {}
    performanceStats.value.totalTurns++
    if (r.feedback_level === 0 || r.feedback_type === 'none') {
      performanceStats.value.correct++
    } else {
      performanceStats.value.needsWork++
    }
    if (r.feedback_type && r.feedback_type !== 'none') showFeedbackCardFn(r)
    if (r.reply || r.text) {
      ahmadLastMessage.value = r.reply || r.text
      speakAloud(r.reply || r.text, r.audio, r.audio_format)
    } else {
      status.value = 'ready'
    }

    if (r.done || r.done_phase) {
      performanceStats.value.strength = r.score_hint
        ? 'You used vocabulary and expressions well.'
        : 'Good effort in this conversation!'
      performanceStats.value.improvement = r.feedback_target && r.feedback_target !== 'none'
        ? `Focus on improving your ${r.feedback_target.replace('_', ' ')}.`
        : 'Try to use longer sentences next time.'
      await doAdvancePhase()
    }
  } catch (e) {
    console.error('API error:', e)
    status.value = 'ready'
    ahmadSpeaking.value = false
  }
}

const showFeedbackCardFn = (r) => {
  const level = r.feedback_level || (r.feedback_type === 'recast' ? 1 : r.feedback_type === 'clarification' ? 2 : 3)
  if (level === 1) { feedbackCard.value = null; return }
  feedbackCard.value = {
    level,
    title: level === 2 ? '💡 Hint' : '✅ Correct Form',
    text: r.feedback_text || r.reply,
    attempt: r.attempt_count || level
  }
}

// ═══ AUDIO PLAYBACK ═══
let isAudioBusy = false

const stopCurrentAudio = () => {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.currentTime = 0
    currentAudio.src = ''
    currentAudio = null
  }
  // Also stop Simli audio to prevent double playback
  if (simliAudioRef.value) {
    simliAudioRef.value.pause()
    simliAudioRef.value.currentTime = 0
  }
  window.speechSynthesis?.cancel()
  ahmadSpeaking.value = false
}

const speakAloud = async (text, audioBase64, audioFormat) => {
  if (!text) { status.value = 'ready'; return }

  // Stop any currently playing audio
  stopCurrentAudio()

  ahmadSpeaking.value = true
  status.value = 'speaking'
  ahmadLastMessage.value = text

  const playAudioBlob = (blob) => {
    const url = URL.createObjectURL(blob)
    currentAudio = new Audio(url)
    currentAudio.onended = () => { ahmadSpeaking.value = false; status.value = 'ready'; URL.revokeObjectURL(url); currentAudio = null; isAudioBusy = false }
    currentAudio.onerror = () => { ahmadSpeaking.value = false; status.value = 'ready'; URL.revokeObjectURL(url); currentAudio = null; isAudioBusy = false }
    currentAudio.play().catch(() => { ahmadSpeaking.value = false; status.value = 'ready'; isAudioBusy = false })

    // Send to Simli for lip sync if connected
    if (simliConnected.value) sendAudioToSimli(blob)
  }

  if (audioBase64 && audioFormat === 'mp3') {
    playAudioBlob(base64ToBlob(audioBase64, 'audio/mpeg'))
    return
  }

  // No audio from backend — fetch it separately via TTS endpoint
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_URL}/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ text }),
    })
    if (!res.ok) {
      console.error('TTS response not ok:', res.status, res.statusText)
    }
    const json = await res.json()
    if (json.data?.audio && json.data.audio_format === 'mp3') {
      playAudioBlob(base64ToBlob(json.data.audio, 'audio/mpeg'))
      return
    }
    console.warn('TTS returned no audio:', json)
  } catch (e) { console.error('TTS fetch failed:', e.message || e) }

  // Really no audio — show message briefly then reset
  setTimeout(() => { ahmadSpeaking.value = false; status.value = 'ready'; isAudioBusy = false }, 2000)
}

const sendAudioToSimli = async (audioBlob) => {
  try {
    const arrayBuffer = await audioBlob.arrayBuffer()
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 })
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)
    const floatData = audioBuffer.getChannelData(0)
    const pcm16 = new Int16Array(floatData.length)
    for (let i = 0; i < floatData.length; i++) {
      const s = Math.max(-1, Math.min(1, floatData[i]))
      pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF
    }
    const chunkSize = 6400
    for (let i = 0; i < pcm16.length; i += chunkSize) {
      const chunk = pcm16.slice(i, i + chunkSize)
      simliSendAudio(new Uint8Array(chunk.buffer))
    }
    audioCtx.close()
  } catch (e) {
    console.error('Simli audio failed:', e)
  }
}

const base64ToBlob = (base64, mimeType) => {
  const byteChars = atob(base64)
  const byteArray = new Uint8Array(byteChars.length)
  for (let i = 0; i < byteChars.length; i++) byteArray[i] = byteChars.charCodeAt(i)
  return new Blob([byteArray], { type: mimeType })
}

const speakVocab = async (text) => {
  // Stop any current audio first
  stopCurrentAudio()
  isAudioBusy = true
  ahmadLastMessage.value = text
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_URL}/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ text }),
    })
    const json = await res.json()
    if (json.data?.audio && json.data.audio_format === 'mp3') {
      await speakAloud(text, json.data.audio, json.data.audio_format)
      return
    }
  } catch (e) { console.warn('TTS failed:', e) }
  isAudioBusy = false
}

// ═══ PHASE MANAGEMENT ═══
let isAdvancing = false

const doAdvancePhase = async () => {
  if (isAdvancing) return // Prevent double-click
  isAdvancing = true
  stopCurrentAudio()
  try {
    const { data } = await apiAdvancePhase(sessionId)
    const r = data || {}
    updatePhaseState(r.phase)

    if (r.message) {
      ahmadLastMessage.value = r.message
      await speakAloud(r.message, r.audio, r.audio_format)
    }
    if (r.done) {
      stopAvatar()
      stopChromaKey()
      localStorage.setItem('last_turns', String(performanceStats.value.totalTurns))
      localStorage.setItem('last_correct', String(performanceStats.value.correct))
      const elapsed = (40 * 60) - remainingTotal.value
      const mins = Math.floor(elapsed / 60)
      const secs = elapsed % 60
      localStorage.setItem('last_duration', `${mins}:${String(secs).padStart(2, '0')}`)
      setTimeout(() => router.push(`/complete/${sessionId}`), 3000)
    }
  } catch (e) { console.error('Phase error:', e) }
  isAdvancing = false
}

const updatePhaseState = (phaseInfo) => {
  if (!phaseInfo) return
  currentPhase.value = phaseInfo.current_phase || 'intro'
  remainingTotal.value = phaseInfo.remaining_total ?? 0
  remainingInPhase.value = phaseInfo.remaining_in_phase ?? 0
  if (phaseInfo.timeline) phases.value = phaseInfo.timeline
}

const finishSession = async () => {
  localStorage.setItem('last_turns', String(performanceStats.value.totalTurns))
  localStorage.setItem('last_correct', String(performanceStats.value.correct))
  try {
    const { data } = await endSession(sessionId)
    if (data?.stats) {
      localStorage.setItem('last_turns', String(data.stats.student_turns || performanceStats.value.totalTurns))
      localStorage.setItem('last_duration', data.stats.duration_formatted || '-')
    }
  } catch(e) {}
  router.push(`/complete/${sessionId}`)
}

const startTimer = () => {
  timerInterval = setInterval(() => {
    if (remainingTotal.value > 0) remainingTotal.value--
    if (remainingInPhase.value > 0) remainingInPhase.value--
  }, 1000)
}

// ═══ LIFECYCLE ═══
onMounted(async () => {
  try {
    const { data } = await startSession(sessionId)
    const r = data || {}
    const scenario = r.scenario || {}
    scenarioTitle.value = scenario.title || 'Conversation with Ahmad'
    communicativeFunction.value = scenario.communicative_function || ''
    completionCriteria.value = scenario.completion_criteria || ''
    vocabulary.value = scenario.vocabulary || []
    scenarioNumber.value = scenario.number || 1
    scenarioContext.value = scenarioContexts[scenario.number] || scenarioContexts[1]

    updatePhaseState(r.phase)

    // Start Simli avatar (fire-and-forget, it will work when ready)
    startAvatar().then(ok => { simliReady.value = ok })

    // Store greeting — will play when welcome is dismissed AND Simli is connected
    const introMsg = r.reply || r.greeting || `Hi! I'm Ahmad. Welcome! Today we will practice ${scenario.title || 'speaking English'}. Are you ready?`
    ahmadLastMessage.value = introMsg
    pendingIntro = { msg: introMsg, audio: r.audio, format: r.audio_format }

    // Simli connection timeout fallback (unlock button after 8s if network is slow)
    setTimeout(() => {
      simliTimedOut.value = true
    }, 8000)

    startTimer()
  } catch (e) {
    console.error('Failed to start:', e)
    scenarioTitle.value = 'Error starting session'
  }
})

onUnmounted(() => {
  recognition?.stop()
  stopCurrentAudio()
  if (timerInterval) clearInterval(timerInterval)
  stopAvatar()
  stopChromaKey()
})

const handleEnd = async () => {
  if (confirm('هل أنت متأكد من إنهاء الجلسة؟')) {
    localStorage.setItem('last_turns', String(performanceStats.value.totalTurns))
    const elapsed = (40 * 60) - remainingTotal.value
    localStorage.setItem('last_duration', `${Math.floor(elapsed/60)}:${String(elapsed%60).padStart(2,'0')}`)
    try {
      const { data } = await endSession(sessionId)
      if (data?.stats) {
        localStorage.setItem('last_turns', String(data.stats.student_turns || 0))
        localStorage.setItem('last_duration', data.stats.duration_formatted || '-')
      }
    } catch(e) {}
    router.push(`/complete/${sessionId}`)
  }
}
</script>

<style scoped>
/* ═══ BASE ═══ */
.session-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  font-family: 'Segoe UI', sans-serif;
  background: #0a1428;
}

/*
  SCENE VIEWPORT — fullscreen background behind Ahmad.
  Simple cover approach: the new backgrounds have no desk,
  so we don't need aspect-ratio tricks anymore.
*/
.scene-viewport {
  position: absolute;
  inset: 0;
  z-index: 0;
  background-size: cover;
  background-position: center center;
  transition: background-image 0.5s ease-in-out;
}

.bg-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  z-index: 0;
}

.session-page > header,
.session-page > .phase-dots-bar,
.session-page > .main-area,
.session-page > footer {
  position: relative;
  z-index: 3;
}

/* ═══ TOP BAR ═══ */
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 18px;
  background: rgba(15, 23, 42, 0.78);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(255,255,255,0.12);
  flex-shrink: 0;
  min-height: 48px;
  position: relative;
  z-index: 10;
}

.tb-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.app-logo {
  color: #60a5fa;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.2px;
}

.app-tagline {
  color: #94a3b8;
  font-size: 10px;
}

.tb-center {
  display: flex;
  align-items: center;
  gap: 8px;
}

.student-badge,
.phase-badge {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.10);
  color: #e2e8f0;
  padding: 5px 11px;
  border-radius: 18px;
  font-size: 11px;
  font-weight: 600;
}

.phase-badge {
  color: #bfdbfe;
  background: rgba(59,130,246,0.16);
  border-color: rgba(59,130,246,0.25);
}

.tb-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.timer-display {
  color: #34d399;
  font-size: 15px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  background: rgba(52,211,153,0.08);
  padding: 5px 9px;
  border-radius: 8px;
}

.timer-display.warning {
  color: #f87171;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.end-btn {
  background: rgba(220,38,38,0.16);
  color: #fca5a5;
  border: 1px solid rgba(220,38,38,0.3);
  padding: 6px 13px;
  border-radius: 9px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  transition: all 0.2s;
}

.end-btn:hover {
  background: rgba(220,38,38,0.28);
  border-color: rgba(220,38,38,0.5);
}
/* Phase dots */
.phase-dots-bar { display: flex; justify-content: center; gap: 20px; padding: 4px 0; flex-shrink: 0; }
.pdot { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.2); position: relative; }
.pdot.current { background: #3b82f6; box-shadow: 0 0 8px rgba(59,130,246,0.5); }
.pdot.done { background: #34d399; }
.pdot-label { display: none; }

/* ═══ MAIN AREA ═══ */
.main-area { flex: 1; display: flex; align-items: stretch; padding: 8px 16px; gap: 12px; overflow: hidden; }

/* LEFT Panel */
.left-panel {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
  overflow-y: auto;
  position: relative;
  z-index: 5;
}

.chat-bubble {
  width: 100%;
  box-sizing: border-box;
  background: rgba(255,255,255,0.95);
  border-radius: 18px 18px 5px 18px;
  padding: 18px 20px;
  box-shadow: 0 7px 22px rgba(0,0,0,0.22);
  direction: ltr;
  text-align: left;
}

.cb-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  direction: ltr;
  gap: 8px;
  margin-bottom: 7px;
}

.cb-name {
  font-weight: 700;
  color: #1e3a5f;
  font-size: 16px;
}

.cb-speaking {
  font-size: 16px;
  animation: pulse-s 1s infinite;
}

@keyframes pulse-s {
  0%,100% {
    opacity: 0.5;
  }

  50% {
    opacity: 1;
  }
}

.cb-text {
  color: #334155;
  font-size: 15px;
  line-height: 1.65;
  margin: 0;
}
.vocab-list { background: rgba(0,0,0,0.55); backdrop-filter: blur(8px); border-radius: 12px; padding: 10px; direction: ltr; text-align: left; }
.vocab-list h4 { color: #fbbf24; font-size: 12px; margin: 0 0 6px; }
.vocab-item { display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.08); border-radius: 6px; padding: 6px 10px; margin: 3px 0; cursor: pointer; transition: all 0.2s; }
.vocab-item:hover { background: rgba(59,130,246,0.2); }
.vi-word { color: #93c5fd; font-size: 12px; font-weight: 600; }
.vi-speaker { font-size: 11px; }

/* ═══ FEEDBACK ═══ */
.feedback-box {
  background: rgba(8, 18, 32, 0.68);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 14px;
  padding: 12px;
  box-shadow: 0 5px 18px rgba(0,0,0,0.18);
  direction: ltr;
  text-align: left;
}

.feedback-box h4 {
  color: white;
  font-size: 14px;
  margin: 0 0 9px;
  font-weight: 700;
}

.fb-stats-row {
  display: flex;
  gap: 5px;
  margin-bottom: 9px;
}

.fb-s {
  flex: 1;
  text-align: center;
  padding: 7px 5px;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 700;
  color: white;
}

.fb-s.green {
  background: rgba(22,163,74,0.32);
}

.fb-s.yellow {
  background: rgba(245,158,11,0.32);
}

.fb-s.blue {
  background: rgba(37,99,235,0.32);
}

.fb-note {
  padding: 8px 10px;
  border-radius: 7px;
  margin-top: 5px;
  font-size: 12px;
  line-height: 1.45;
  color: #e2e8f0;
}

.fb-note.strength {
  background: rgba(22,163,74,0.16);
  border-left: 3px solid #16a34a;
}

.fb-note.improve {
  background: rgba(245,158,11,0.16);
  border-left: 3px solid #f59e0b;
}

.phase-actions { margin-top: auto; }
.action-btn { width: 100%; padding: 10px; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.action-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(37,99,235,0.4); }
.action-btn.finish { background: linear-gradient(135deg, #16a34a, #15803d); }

/* CENTER: layout spacer (Ahmad is now inside .scene-viewport) */
.center-panel {
  flex: 1;
  min-width: 0;
  position: relative;
  z-index: 1;
}

.hidden-video {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 1px;
  height: 1px;
}

/*
  AHMAD AVATAR — positioned at bottom-center of the viewport.
  No desk overlay needed — the avatar's chroma-keyed video
  naturally shows upper body, fading into the background.
*/
.ahmad-canvas {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  height: 65%;
  width: auto;
  max-width: 50%;
  object-fit: contain;
  z-index: 1;
  pointer-events: none;
  transition: opacity 0.5s ease;

  /* Subtle shadow to ground the avatar in the scene */
  filter:
    drop-shadow(0 8px 24px rgba(0, 0, 0, 0.4))
    drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
}

/* ═══ WELCOME OVERLAY ═══ */
.welcome-overlay {
  position: absolute;
  inset: 0;
  background: rgba(10, 20, 40, 0.92);
  backdrop-filter: blur(16px);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.welcome-card {
  background: #ffffff;
  border-radius: 22px;
  padding: 0;
  max-width: 460px;
  width: 100%;
  overflow: hidden;
  box-shadow:
    0 25px 65px rgba(0, 0, 0, 0.35),
    0 0 0 1px rgba(255, 255, 255, 0.06);
  animation: wcSlideUp 0.5s ease-out;
  direction: ltr;
  text-align: left;
}

@keyframes wcSlideUp {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ── Card Header ── */
.wc-header {
  background: linear-gradient(135deg, #102a43, #1a3a5c);
  padding: 22px 30px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.wc-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: rgba(59, 130, 246, 0.20);
  display: flex;
  align-items: center;
  justify-content: center;
}

.wc-icon {
  font-size: 24px;
}

.wc-session-tag {
  background: rgba(59, 130, 246, 0.22);
  color: #93c5fd;
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

/* ── Title & Description ── */
.wc-title {
  color: #102a43;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin: 0;
  padding: 22px 30px 0;
}

.wc-desc {
  color: #64748b;
  font-size: 13px;
  line-height: 1.65;
  margin: 8px 0 0;
  padding: 0 30px;
}

/* ── Divider ── */
.wc-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
  margin: 18px 30px;
}

/* ── Learning Goals ── */
.wc-goals {
  padding: 0 30px;
  margin-bottom: 16px;
}

.wc-goals-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #d97706;
  font-size: 13px;
  font-weight: 700;
  margin: 0 0 10px;
}

.wc-goals-icon {
  font-size: 15px;
}

.wc-goal-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #334155;
  font-size: 13px;
  padding: 6px 0;
  line-height: 1.4;
  opacity: 0;
  animation: wcGoalSlide 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes wcGoalSlide {
  from {
    opacity: 0;
    transform: translateX(-18px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.wc-goal-check {
  width: 22px;
  height: 22px;
  border-radius: 7px;
  background: #dbeafe;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  flex-shrink: 0;
}

/* ── Quote ── */
.wc-quote {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin: 0 30px 20px;
  padding: 12px 14px;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 3px solid #bfdbfe;
}

.wc-quote-mark {
  color: #bfdbfe;
  font-size: 28px;
  font-weight: 800;
  line-height: 1;
  flex-shrink: 0;
}

.wc-quote p {
  color: #64748b;
  font-size: 12px;
  font-style: italic;
  line-height: 1.5;
  margin: 2px 0 0;
}

.wc-quote-author {
  color: #94a3b8;
  font-size: 10px;
  font-weight: 600;
}

/* ── Action Button ── */
.wc-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% - 60px);
  margin: 0 30px;
  padding: 14px 20px;
  border: none;
  border-radius: 13px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.wc-btn.ready {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.30);
}

.wc-btn.ready:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(37, 99, 235, 0.40);
}

.wc-btn.loading {
  background: #f1f5f9;
  color: #64748b;
  cursor: wait;
}

.wc-btn:disabled {
  cursor: wait;
}

.wc-btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.wc-btn-arrow {
  font-size: 18px;
  transition: transform 0.2s ease;
}

.wc-btn.ready:hover .wc-btn-arrow {
  transform: translateX(3px);
}

.wc-btn-loading {
  gap: 10px;
}

/* ── Spinner ── */
.wc-spinner {
  width: 18px;
  height: 18px;
  border: 2.5px solid #cbd5e1;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: wcSpin 0.8s linear infinite;
  flex-shrink: 0;
}

@keyframes wcSpin {
  to { transform: rotate(360deg); }
}

/* ── Footer Hint ── */
.wc-footer-hint {
  text-align: center;
  color: #94a3b8;
  font-size: 11px;
  margin: 12px 0 0;
  padding: 0 30px 22px;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.ahmad-static { max-height: 85%; max-width: 400px; object-fit: contain; filter: drop-shadow(0 8px 24px rgba(0,0,0,0.4)); transition: all 0.3s; }
.ahmad-static.speaking { filter: drop-shadow(0 8px 30px rgba(59,130,246,0.4)); }
/* RIGHT Panel */
.right-panel {
  width: 270px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: relative;
  z-index: 5;
}

.scenario-card {
  background: rgba(15, 23, 42, 0.72);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.18);
  direction: ltr;
  text-align: left;
}

.sc-tag {
  display: inline-block;
  background: rgba(59,130,246,0.25);
  color: #bfdbfe;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 700;
}

.sc-title {
  color: white;
  font-size: 19px;
  font-weight: 700;
  margin: 8px 0 6px;
  line-height: 1.25;
}

.sc-desc {
  color: #dbe4f0;
  font-size: 12px;
  margin: 0 0 14px;
  line-height: 1.55;
}

.sc-goals {
  padding-top: 2px;
}

.sc-goals h4 {
  color: #fbbf24;
  font-size: 12px;
  margin: 0 0 7px;
}

.sc-goal-item {
  color: #e2e8f0;
  font-size: 11px;
  line-height: 1.45;
  margin: 5px 0;
}

.quote-box {
  margin-top: 14px;
  padding: 10px;
  background: rgba(255,255,255,0.06);
  border-radius: 10px;
  border-left: 3px solid rgba(59,130,246,0.6);
}

.quote-box p {
  color: #dbe4f0;
  font-size: 11px;
  font-style: italic;
  line-height: 1.45;
  margin: 0;
}

.quote-box span {
  display: block;
  color: #94a3b8;
  font-size: 9px;
  margin-top: 5px;
}

/* ═══ FEEDBACK CARD ═══ */
.feedback-card { position: absolute; bottom: 110px; left: 50%; transform: translateX(-50%); background: white; border-radius: 12px; padding: 12px 16px; max-width: 360px; width: 90%; box-shadow: 0 8px 30px rgba(0,0,0,0.4); z-index: 20; direction: ltr; text-align: left; }
.feedback-card.level-2 { border-top: 4px solid #f59e0b; }
.feedback-card.level-3 { border-top: 4px solid #16a34a; }
.fc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
.fc-title { font-weight: 700; color: #1e3a5f; font-size: 13px; }
.attempt-dots { display: flex; gap: 4px; }
.dot { width: 8px; height: 8px; border-radius: 50%; background: #e2e8f0; }
.dot.used { background: #dc2626; }
.fc-text { color: #334155; font-size: 12px; margin: 0; }
.listen-btn { background: #2563eb; color: white; border: none; padding: 4px 12px; border-radius: 6px; cursor: pointer; font-size: 11px; margin-top: 6px; }
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateX(-50%) translateY(20px); opacity: 0; }

/* ═══ CONTROL BAR ═══ */
.control-bar { display: flex; align-items: center; justify-content: center; gap: 16px; padding: 4px 16px 6px; background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5)); backdrop-filter: blur(10px); border-top: none; flex-shrink: 0; position: relative; z-index: 10; }
.cb-btn { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #cbd5e1; padding: 6px 12px; border-radius: 8px; cursor: pointer; font-size: 11px; transition: all 0.2s; }
.cb-btn:hover, .cb-btn.active { background: rgba(59,130,246,0.2); border-color: #3b82f6; }

/* ═══ MICROPHONE ═══ */
.mic-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  position: relative;
  min-width: 160px;
}

/* Animated outer ring */
.mic-ring {
  position: absolute;
  top: -5px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  pointer-events: none;
  z-index: 0;
}

.ring-blue {
  border-color: #3b82f6;
  box-shadow:
    0 0 14px rgba(59,130,246,0.55),
    0 0 30px rgba(59,130,246,0.20);
  animation: rp 1.5s infinite;
}

.ring-green {
  border-color: #34d399;
  box-shadow:
    0 0 14px rgba(52,211,153,0.60),
    0 0 32px rgba(52,211,153,0.25);
  animation: rp 1s infinite;
}

.ring-yellow {
  border-color: #fbbf24;
  box-shadow:
    0 0 14px rgba(251,191,36,0.55),
    0 0 30px rgba(251,191,36,0.20);
  animation: rp 1.2s infinite;
}

.ring-idle {
  border-color: rgba(255,255,255,0.18);
}

@keyframes rp {
  0%,100% {
    opacity: 0.45;
    transform: scale(0.94);
  }

  50% {
    opacity: 1;
    transform: scale(1.06);
  }
}

/* ═══ Voice Waveform ═══ */
.mic-area::before,
.mic-area::after {
  content: "";
  position: absolute;
  top: 14px;
  width: 60px;
  height: 16px;
  opacity: 0.85;
  pointer-events: none;
  transition: all 0.3s ease;
}

.mic-area::before {
  right: calc(50% + 42px);
  background:
    linear-gradient(#34d399,#34d399) 0 50% / 3px 8px no-repeat,
    linear-gradient(#34d399,#34d399) 9px 50% / 3px 14px no-repeat,
    linear-gradient(#34d399,#34d399) 18px 50% / 3px 20px no-repeat,
    linear-gradient(#34d399,#34d399) 27px 50% / 3px 12px no-repeat,
    linear-gradient(#34d399,#34d399) 36px 50% / 3px 24px no-repeat,
    linear-gradient(#34d399,#34d399) 45px 50% / 3px 15px no-repeat,
    linear-gradient(#34d399,#34d399) 54px 50% / 3px 9px no-repeat,
    linear-gradient(#34d399,#34d399) 63px 50% / 3px 5px no-repeat;
  transform-origin: right center;
  animation: waveLeft 1s ease-in-out infinite;
}

.mic-area::after {
  left: calc(50% + 42px);
  background:
    linear-gradient(#34d399,#34d399) 0 50% / 3px 5px no-repeat,
    linear-gradient(#34d399,#34d399) 9px 50% / 3px 9px no-repeat,
    linear-gradient(#34d399,#34d399) 18px 50% / 3px 15px no-repeat,
    linear-gradient(#34d399,#34d399) 27px 50% / 3px 24px no-repeat,
    linear-gradient(#34d399,#34d399) 36px 50% / 3px 12px no-repeat,
    linear-gradient(#34d399,#34d399) 45px 50% / 3px 20px no-repeat,
    linear-gradient(#34d399,#34d399) 54px 50% / 3px 14px no-repeat,
    linear-gradient(#34d399,#34d399) 63px 50% / 3px 8px no-repeat;
  transform-origin: left center;
  animation: waveRight 1s ease-in-out infinite;
}

@keyframes waveLeft {
  0%,100% { transform: scaleY(0.65); opacity: 0.45; }
  50% { transform: scaleY(1); opacity: 1; }
}

@keyframes waveRight {
  0%,100% { transform: scaleY(0.65); opacity: 0.45; }
  50% { transform: scaleY(1); opacity: 1; }
}

/* ═══ Main Microphone ═══ */
.mic-btn {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.20);

  background:
    radial-gradient(circle at 35% 30%, rgba(255,255,255,0.18), transparent 35%),
    linear-gradient(145deg, #2563eb, #1e40af);

  color: white;
  font-size: 20px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  transition:
    transform 0.2s ease,
    box-shadow 0.25s ease,
    background 0.25s ease;

  z-index: 2;

  box-shadow:
    0 4px 12px rgba(0,0,0,0.30),
    0 0 0 3px rgba(59,130,246,0.10),
    0 0 16px rgba(59,130,246,0.30);
}

.mic-btn:hover:not(:disabled) {
  transform: scale(1.06);

  box-shadow:
    0 10px 24px rgba(0,0,0,0.35),
    0 0 0 6px rgba(59,130,246,0.14),
    0 0 30px rgba(59,130,246,0.40);
}

.mic-btn:active:not(:disabled) {
  transform: scale(0.96);
}

/* Listening */
.mic-btn.active {
  background:
    radial-gradient(circle at 35% 30%, rgba(255,255,255,0.20), transparent 35%),
    linear-gradient(145deg, #16a34a, #15803d);

  animation: mg 1s infinite;

  box-shadow:
    0 8px 22px rgba(0,0,0,0.30),
    0 0 0 6px rgba(52,211,153,0.12),
    0 0 32px rgba(52,211,153,0.45);
}

.mic-btn.disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

/* Listening pulse */
@keyframes mg {
  0%,100% {
    box-shadow:
      0 8px 22px rgba(0,0,0,0.30),
      0 0 0 0 rgba(52,211,153,0.45),
      0 0 24px rgba(52,211,153,0.25);
  }

  50% {
    box-shadow:
      0 8px 22px rgba(0,0,0,0.30),
      0 0 0 12px rgba(52,211,153,0),
      0 0 36px rgba(52,211,153,0.45);
  }
}
.mic-status {
  color: #e2e8f0;
  font-size: 9px;
  font-weight: 600;
  white-space: nowrap;
  min-width: 100px;
  text-align: center;
  padding: 2px 6px;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(6px);
  text-shadow: 0 1px 3px rgba(0,0,0,0.35);
}
.waveform { display: flex; align-items: center; gap: 2px; height: 16px; }
.wave-bar { width: 2px; background: #34d399; border-radius: 2px; animation: wa 0.6s ease-in-out infinite alternate; }
@keyframes wa { 0%{height:3px} 100%{height:14px} }

.phase-dots-mini { display: flex; gap: 5px; }
.pm { width: 7px; height: 7px; border-radius: 50%; background: rgba(255,255,255,0.2); }
.pm.current { background: #3b82f6; }
.pm.done { background: #34d399; }

/* Typing */
.typing-overlay { position: absolute; bottom: 80px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; z-index: 30; }
.typing-input { width: 300px; padding: 8px 12px; border-radius: 8px; border: 2px solid #3b82f6; font-size: 13px; outline: none; }
.send-typed-btn { background: #2563eb; color: white; border: none; padding: 8px 14px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 12px; }
.close-typing { background: rgba(220,38,38,0.8); color: white; border: none; width: 32px; height: 32px; border-radius: 6px; cursor: pointer; font-size: 14px; }

/* ═══ Scenario Toggle Button (Mobile/Tablet) ═══ */
.scenario-toggle-btn {
  display: none;
  background: rgba(59, 130, 246, 0.2);
  color: #bfdbfe;
  border: 1px solid rgba(59, 130, 246, 0.4);
  padding: 5px 11px;
  border-radius: 9px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.scenario-toggle-btn:hover {
  background: rgba(59, 130, 246, 0.35);
  border-color: rgba(59, 130, 246, 0.6);
}

.mobile-scenario-close {
  display: none;
  text-align: left;
  direction: ltr;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.mobile-scenario-close:hover {
  color: #f87171;
}

/* =========================================================
   RESPONSIVE DESIGN (Laptop, Tablet, Mobile)
========================================================= */

/* ═══ Laptop / Medium Desktop (max-width: 1200px) ═══ */
@media (max-width: 1200px) {
  .left-panel {
    width: 260px;
  }
  .right-panel {
    width: 230px;
  }
  .main-area {
    gap: 10px;
    padding: 6px 12px;
  }
}

/* ═══ Tablet (max-width: 900px) ═══ */
@media (max-width: 900px) {
  .top-bar {
    padding: 6px 12px;
  }
  .app-tagline {
    display: none;
  }
  .student-badge,
  .phase-badge {
    padding: 4px 8px;
    font-size: 10px;
  }
  .timer-display {
    font-size: 13px;
    padding: 4px 8px;
  }
  .end-btn {
    padding: 5px 10px;
    font-size: 10px;
  }

  .scenario-toggle-btn {
    display: inline-flex;
    align-items: center;
  }

  .left-panel {
    width: 240px;
  }

  /* Scenario card collapses into overlay on tablet */
  .right-panel {
    position: fixed;
    top: 60px;
    right: 16px;
    width: 300px;
    max-height: calc(100vh - 160px);
    overflow-y: auto;
    z-index: 99;
    transition: all 0.3s ease;
    transform: translateY(-20px);
    opacity: 0;
    pointer-events: none;
  }
  .right-panel.mobile-open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }
  .mobile-scenario-close {
    display: block;
  }
}

/* ═══ Mobile Phones (max-width: 680px) ═══ */
@media (max-width: 680px) {
  .top-bar {
    padding: 6px 10px;
    min-height: 44px;
    gap: 4px;
  }
  .app-logo {
    font-size: 13px;
  }
  .student-badge {
    display: none;
  }
  .phase-badge {
    padding: 3px 6px;
    font-size: 9px;
  }
  .timer-display {
    font-size: 12px;
    padding: 3px 6px;
  }
  .end-btn {
    padding: 4px 8px;
    font-size: 9px;
  }

  /* Avatar: same natural style as desktop, sized for mobile */
  .ahmad-canvas {
    height: 45%;
    width: auto;
    max-width: 65%;
    bottom: 55px;
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    border-radius: 0;
    border: none;
    background: none;
    object-fit: contain;
  }

  /* Main area vertical layout on mobile */
  .main-area {
    flex-direction: column;
    padding: 4px 8px;
    gap: 4px;
    overflow: hidden;
  }

  /* Left panel (Chat bubble) — compact so it doesn't cover Ahmad */
  .left-panel {
    width: 100%;
    max-height: 28%;
    flex-shrink: 0;
    overflow-y: auto;
    z-index: 10;
  }

  .chat-bubble {
    padding: 8px 12px;
    border-radius: 14px;
  }
  .cb-name {
    font-size: 13px;
  }
  .cb-text {
    font-size: 12px;
    line-height: 1.4;
  }

  /* Action buttons: compact on mobile */
  .action-btn {
    padding: 8px;
    font-size: 12px;
    border-radius: 8px;
  }

  /* Center panel: Ahmad is full width and centered */
  .center-panel {
    width: 100%;
    flex: 1;
    min-height: 0;
    align-items: flex-end;
  }

  /* Scenario card as mobile bottom/drawer modal */
  .right-panel {
    position: fixed;
    top: 50px;
    left: 10px;
    right: 10px;
    width: auto;
    max-height: 75vh;
    overflow-y: auto;
    z-index: 100;
    background: rgba(15, 23, 42, 0.95);
    border-radius: 16px;
    box-shadow: 0 12px 36px rgba(0,0,0,0.5);
  }

  /* Control bar (Microphone) */
  .control-bar {
    padding: 3px 8px 5px;
    gap: 6px;
  }
  .mic-btn {
    width: 38px;
    height: 38px;
    font-size: 17px;
  }
  .mic-ring {
    width: 44px;
    height: 44px;
    top: -4px;
  }
  .mic-area {
    min-width: 100px;
  }
  .mic-status {
    font-size: 8px;
    min-width: 70px;
  }
  .cb-btn {
    padding: 4px 8px;
    font-size: 10px;
  }
  .waveform {
    display: none;
  }
}
</style>
