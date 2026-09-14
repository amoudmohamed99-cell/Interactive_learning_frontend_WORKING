<template>
  <div class="check-page">
    <div class="check-card">
      <h1 class="check-title">فحص النظام</h1>
      <p class="check-subtitle">تأكد من جاهزية جهازك قبل بدء الجلسة</p>

      <!-- Step 1: Student Code -->
      <div class="check-step" :class="{ done: studentCode }">
        <div class="step-header">
          <span class="step-num">1</span>
          <span class="step-label">كود الطالب</span>
          <span v-if="studentCode" class="step-check">✅</span>
        </div>
        <div class="step-body">
          <div class="student-id-display" v-if="studentCode">{{ studentCode }}</div>
        </div>
      </div>

      <!-- Step 2: Mic Test -->
      <div class="check-step" :class="{ done: micPassed, active: !micPassed }">
        <div class="step-header">
          <span class="step-num">2</span>
          <span class="step-label">اختبار الميكروفون</span>
          <span v-if="micPassed" class="step-check">✅</span>
        </div>
        <div class="step-body">
          <p class="step-note">اضغط الزر وقل كلمة قصيرة بالإنجليزية</p>
          <button class="test-btn" :class="{ recording: micTesting, passed: micPassed }" @click="testMic" :disabled="micPassed">
            <span class="btn-icon">{{ micTesting ? '🔴' : micPassed ? '✅' : '🎤' }}</span>
            {{ micTesting ? 'جاري التسجيل...' : micPassed ? 'الميكروفون يعمل' : 'اختبار الميكروفون' }}
          </button>
          <div v-if="micTesting" class="waveform-test">
            <div v-for="i in 12" :key="i" class="wave-bar" :style="{ animationDelay: (i * 0.05) + 's' }"></div>
          </div>
          <div v-if="micResult" class="mic-result" :class="micResult.ok ? 'ok' : 'fail'">{{ micResult.message }}</div>
        </div>
      </div>

      <!-- Step 3: Speaker Test -->
      <div class="check-step" :class="{ done: speakerPassed, active: !speakerPassed && micPassed }">
        <div class="step-header">
          <span class="step-num">3</span>
          <span class="step-label">اختبار السماعات</span>
          <span v-if="speakerPassed" class="step-check">✅</span>
        </div>
        <div class="step-body">
          <p class="step-note">اضغط الزر واستمع لصوت أحمد الترحيبي</p>
          <button class="test-btn" :class="{ playing: speakerTesting, passed: speakerPassed }" @click="testSpeaker" :disabled="speakerPassed || !micPassed">
            <span class="btn-icon">{{ speakerTesting ? '🔊' : speakerPassed ? '✅' : '🔈' }}</span>
            {{ speakerTesting ? 'جاري التشغيل...' : speakerPassed ? 'السماعات تعمل' : 'اختبار السماعات' }}
          </button>
          <div v-if="showSpeakerConfirm" class="speaker-confirm">
            <button class="confirm-yes" @click="speakerPassed = true; showSpeakerConfirm = false">نعم، أسمع ✅</button>
            <button class="confirm-no" @click="showSpeakerConfirm = false; speakerTesting = false">لا أسمع ❌</button>
          </div>
        </div>
      </div>

      <button class="start-session-btn" :disabled="!micPassed || !speakerPassed" @click="goToSession">
        🚀 ابدأ الجلسة
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const sessionId = route.params.id

const studentCode = ref('')
const micPassed = ref(false)
const micTesting = ref(false)
const micResult = ref(null)
const speakerPassed = ref(false)
const speakerTesting = ref(false)
const showSpeakerConfirm = ref(false)

onMounted(() => {
  studentCode.value = localStorage.getItem('student_code') || 'STD-' + sessionId
})

const testMic = async () => {
  micTesting.value = true
  micResult.value = null
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      micResult.value = { ok: true, message: 'الميكروفون يعمل ✅' }
      micPassed.value = true
      stream.getTracks().forEach(t => t.stop())
      micTesting.value = false
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.continuous = false
    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript
      const confidence = e.results[0][0].confidence
      micResult.value = { ok: true, message: `✅ تم التقاط: "${text}" — دقة: ${Math.round(confidence * 100)}%` }
      micPassed.value = true
      micTesting.value = false
      stream.getTracks().forEach(t => t.stop())
    }
    recognition.onerror = () => {
      micResult.value = { ok: false, message: '⚠️ لم يتم التقاط صوت. حاول مرة أخرى' }
      micTesting.value = false
      stream.getTracks().forEach(t => t.stop())
    }
    recognition.onend = () => {
      if (!micPassed.value && !micResult.value) {
        micResult.value = { ok: false, message: '⚠️ لم يتم التقاط كلام. حاول بصوت أوضح' }
      }
      micTesting.value = false
      stream.getTracks().forEach(t => t.stop())
    }
    setTimeout(() => { try { recognition.stop() } catch(e) {} }, 5000)
    recognition.start()
  } catch (e) {
    micResult.value = { ok: false, message: '❌ لا يمكن الوصول للميكروفون' }
    micTesting.value = false
  }
}

const testSpeaker = async () => {
  speakerTesting.value = true
  const testText = "Hello! I am Ahmad. Can you hear me clearly? Let's practice English together!"
  
  try {
    // Use Ahmad's ElevenLabs voice via backend
    const token = localStorage.getItem('token')
    const res = await fetch('/api/v1/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ text: testText }),
    })
    const json = await res.json()
    
    if (json.data?.audio && json.data.audio_format === 'mp3') {
      const byteChars = atob(json.data.audio)
      const byteArray = new Uint8Array(byteChars.length)
      for (let i = 0; i < byteChars.length; i++) byteArray[i] = byteChars.charCodeAt(i)
      const blob = new Blob([byteArray], { type: 'audio/mpeg' })
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audio.onended = () => { showSpeakerConfirm.value = true; speakerTesting.value = false; URL.revokeObjectURL(url) }
      audio.onerror = () => { alert('❌ خطأ في تشغيل الصوت'); speakerTesting.value = false }
      audio.play().catch(() => { alert('❌ خطأ في تشغيل الصوت'); speakerTesting.value = false })
      return
    }
    // No audio returned
    alert('❌ لم يتم استلام الصوت — تأكد من تشغيل Laragon وعمل Restart')
    speakerTesting.value = false
  } catch (e) {
    console.error('TTS Error:', e)
    alert('❌ لا يمكن الاتصال بالسيرفر — تأكد من تشغيل Laragon')
    speakerTesting.value = false
  }
}

const goToSession = () => {
  router.push(`/session/${sessionId}`)
}
</script>

<style scoped>
.check-page { min-height: 100vh; background: linear-gradient(135deg, #0f172a, #1e3a5f); display: flex; align-items: center; justify-content: center; padding: 20px; }
.check-card { background: white; border-radius: 24px; padding: 40px; max-width: 480px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
.check-title { text-align: center; color: #1e3a5f; font-size: 24px; margin: 0; }
.check-subtitle { text-align: center; color: #64748b; font-size: 14px; margin-bottom: 30px; }
.check-step { background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 16px; padding: 16px; margin-bottom: 16px; transition: all 0.3s; }
.check-step.active { border-color: #2563eb; background: #f0f9ff; }
.check-step.done { border-color: #16a34a; background: #f0fdf4; }
.step-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.step-num { width: 28px; height: 28px; background: #2563eb; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; }
.done .step-num { background: #16a34a; }
.step-label { font-weight: 600; color: #1e3a5f; font-size: 15px; }
.step-check { font-size: 18px; margin-right: auto; }
.step-note { color: #64748b; font-size: 13px; margin-bottom: 10px; }
.student-id-display { background: #1e3a5f; color: white; padding: 10px 20px; border-radius: 10px; font-size: 20px; font-weight: 700; text-align: center; letter-spacing: 2px; direction: ltr; }
.test-btn { width: 100%; padding: 12px; border: 2px solid #2563eb; background: white; color: #2563eb; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.3s; }
.test-btn:hover:not(:disabled) { background: #2563eb; color: white; }
.test-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.test-btn.recording { background: #dc2626; border-color: #dc2626; color: white; animation: pulse-red 1s infinite; }
.test-btn.playing { background: #2563eb; border-color: #2563eb; color: white; }
.test-btn.passed { background: #16a34a; border-color: #16a34a; color: white; }
@keyframes pulse-red { 0%, 100% { box-shadow: 0 0 0 0 rgba(220,38,38,0.3); } 50% { box-shadow: 0 0 0 10px rgba(220,38,38,0); } }
.waveform-test { display: flex; align-items: center; justify-content: center; gap: 3px; height: 30px; margin-top: 10px; }
.wave-bar { width: 4px; background: #2563eb; border-radius: 2px; animation: wave 0.8s ease-in-out infinite alternate; }
@keyframes wave { 0% { height: 5px; } 100% { height: 25px; } }
.mic-result { margin-top: 10px; padding: 8px 12px; border-radius: 8px; font-size: 13px; text-align: center; direction: ltr; }
.mic-result.ok { background: #f0fdf4; color: #16a34a; }
.mic-result.fail { background: #fef2f2; color: #dc2626; }
.speaker-confirm { display: flex; gap: 10px; margin-top: 10px; }
.confirm-yes { flex: 1; padding: 10px; background: #16a34a; color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; }
.confirm-no { flex: 1; padding: 10px; background: #dc2626; color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; }
.start-session-btn { width: 100%; padding: 16px; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; border: none; border-radius: 16px; font-size: 18px; font-weight: 700; cursor: pointer; margin-top: 10px; transition: all 0.3s; }
.start-session-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(37,99,235,0.3); }
.start-session-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-icon { font-size: 18px; }
</style>
