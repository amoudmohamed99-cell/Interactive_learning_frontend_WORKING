<template>
  <div class="check-page">

    <!-- =========================
         TOP BAR
    ========================== -->
    <header class="top-bar">

      <!-- LEFT -->
      <div class="student-area">

        <div class="student-badge">
          <div class="student-icon">
            👋
          </div>

          <div class="student-info">
            <span class="student-label">Student</span>
            <strong>{{ studentCode }}</strong>
          </div>
        </div>

        <button
          class="logout-btn"
          @click="handleLogout"
        >
          خروج
        </button>

      </div>


      <!-- RIGHT -->
      <div class="brand">
        <div class="brand-name">
          SpeakBetter
        </div>

        <div class="brand-tagline">
          Real Conversations. A Brighter You.
        </div>
      </div>

    </header>


    <!-- =========================
         MAIN
    ========================== -->
    <main class="check-content">

      <!-- Decorative background -->
      <div class="bg-circle bg-circle-one"></div>
      <div class="bg-circle bg-circle-two"></div>

      <div class="bg-line bg-line-one"></div>
      <div class="bg-line bg-line-two"></div>


      <div class="check-layout">

        <!-- =========================
             LEFT INTRO
        ========================== -->
        <section class="intro-section">

          <span class="intro-eyebrow">
            GET READY
          </span>

          <h1 class="intro-title">
            Check Your System
            <span>Before We Start</span>
          </h1>

          <p class="intro-description">
            Let’s make sure everything is working properly
            so you can have the best speaking experience
            with Ahmad.
          </p>


          <div class="feature-item">

            <div class="feature-icon">
              🎤
            </div>

            <div class="feature-text">
              <strong>Microphone</strong>
              <span>Speak and be heard clearly</span>
            </div>

          </div>


          <div class="feature-item">

            <div class="feature-icon">
              🔊
            </div>

            <div class="feature-text">
              <strong>Speakers</strong>
              <span>Listen to Ahmad's voice</span>
            </div>

          </div>


          <div class="feature-item">

            <div class="feature-icon">
              ⚙️
            </div>

            <div class="feature-text">
              <strong>Session Ready</strong>
              <span>A smooth and stable experience</span>
            </div>

          </div>


          <div class="intro-footer">
            <span class="footer-line"></span>
            Small check. A better conversation!
          </div>

        </section>


        <!-- =========================
             SYSTEM CHECK CARD
        ========================== -->
        <section class="check-card">

          <div class="card-icon">
            ⚙️
          </div>

          <h2 class="card-title">
            System Check
          </h2>

          <p class="card-subtitle">
            Make sure your devices are working properly
            before the session.
          </p>


          <!-- =========================
               STEP 1
          ========================== -->
          <div
            class="check-item student-item"
          >

            <div class="item-icon">
              👤
            </div>

            <div class="item-content">
              <strong>Student Code</strong>
              <span>{{ studentCode }}</span>
            </div>

            <div class="status-badge success">
              ✓
            </div>

          </div>


          <!-- =========================
               STEP 2 - MICROPHONE
          ========================== -->
          <div
            class="check-item"
            :class="{
              active: !micPassed,
              'success-item': micPassed
            }"
          >

            <div class="item-icon mic-icon">
              🎤
            </div>

            <div class="item-content">

              <strong>
                Test Microphone
              </strong>

              <span v-if="micTesting">
                Listening for your voice...
              </span>

              <span v-else-if="micPassed">
                Microphone is working
              </span>

              <span v-else>
                Speak a short English word
              </span>

            </div>


            <button
              class="test-btn"
              :class="{
                recording: micTesting,
                passed: micPassed
              }"
              @click="testMic"
              :disabled="micPassed"
            >

              <span class="btn-icon">
                {{
                  micTesting
                    ? '🔴'
                    : micPassed
                      ? '✅'
                      : '🎤'
                }}
              </span>

              {{
                micTesting
                  ? 'Testing...'
                  : micPassed
                    ? 'Done'
                    : 'Test'
              }}

            </button>

          </div>


          <!-- Waveform -->
          <div
            v-if="micTesting"
            class="waveform-test"
          >

            <div
              v-for="i in 12"
              :key="i"
              class="wave-bar"
              :style="{
                animationDelay:
                  (i * 0.05) + 's'
              }"
            ></div>

          </div>


          <!-- Mic result -->
          <div
            v-if="micResult"
            class="mic-result"
            :class="
              micResult.ok
                ? 'ok'
                : 'fail'
            "
          >
            {{ micResult.message }}
          </div>


          <!-- =========================
               STEP 3 - SPEAKER
          ========================== -->
          <div
            class="check-item"
            :class="{
              active:
                !speakerPassed &&
                micPassed,

              disabled:
                !micPassed,

              'success-item':
                speakerPassed
            }"
          >

            <div class="item-icon speaker-icon">
              🔊
            </div>


            <div class="item-content">

              <strong>
                Test Speakers
              </strong>

              <span v-if="speakerTesting">
                Playing Ahmad's voice...
              </span>

              <span v-else-if="speakerPassed">
                Speakers are working
              </span>

              <span v-else>
                Listen to Ahmad's voice
              </span>

            </div>


            <button
              class="test-btn"
              :class="{
                playing: speakerTesting,
                passed: speakerPassed
              }"
              @click="testSpeaker"
              :disabled="
                speakerPassed ||
                !micPassed
              "
            >

              <span class="btn-icon">
                {{
                  speakerTesting
                    ? '🔊'
                    : speakerPassed
                      ? '✅'
                      : '🔈'
                }}
              </span>

              {{
                speakerTesting
                  ? 'Playing...'
                  : speakerPassed
                    ? 'Done'
                    : 'Test'
              }}

            </button>

          </div>


          <!-- Speaker confirmation -->
          <div
            v-if="showSpeakerConfirm"
            class="speaker-confirm"
          >

            <button
              class="confirm-yes"
              @click="
                speakerPassed = true;
                showSpeakerConfirm = false
              "
            >
              Yes, I can hear ✓
            </button>

            <button
              class="confirm-no"
              @click="
                showSpeakerConfirm = false;
                speakerTesting = false
              "
            >
              No, I can't
            </button>

          </div>


          <!-- =========================
               READY
          ========================== -->
          <div
            class="ready-status"
            :class="{
              ready:
                micPassed &&
                speakerPassed
            }"
          >

            <div class="ready-dot"></div>

            <span
              v-if="
                micPassed &&
                speakerPassed
              "
            >
              Everything is ready!
            </span>

            <span v-else>
              Complete the checks above
            </span>

          </div>


          <!-- =========================
               START
          ========================== -->
          <button
            class="start-session-btn"
            :disabled="
              !micPassed ||
              !speakerPassed
            "
            @click="goToSession"
          >

            Continue to Session

            <span class="arrow">
              →
            </span>

          </button>


          <p class="card-footer">
            Everything good? Let’s go!
          </p>

        </section>

      </div>

    </main>

  </div>
</template>


<script setup>

import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { API_URL } from '../api'

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
  studentCode.value =
    localStorage.getItem('student_code') ||
    'STD-' + sessionId
})


/* =========================
   LOGOUT
========================= */

const handleLogout = () => {

  localStorage.removeItem('token')
  localStorage.removeItem('student')
  localStorage.removeItem('student_code')

  router.push('/')
}


/* =========================
   MICROPHONE TEST
========================= */

const testMic = async () => {

  micTesting.value = true
  micResult.value = null

  try {

    const stream =
      await navigator.mediaDevices.getUserMedia({
        audio: true
      })

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition

    if (!SpeechRecognition) {

      micResult.value = {
        ok: true,
        message: 'الميكروفون يعمل ✅'
      }

      micPassed.value = true

      stream
        .getTracks()
        .forEach(t => t.stop())

      micTesting.value = false

      return
    }

    const recognition =
      new SpeechRecognition()

    recognition.lang = 'en-US'
    recognition.continuous = false

    recognition.onresult = (e) => {

      const text =
        e.results[0][0].transcript

      const confidence =
        e.results[0][0].confidence

      micResult.value = {
        ok: true,
        message:
          `✅ تم التقاط: "${text}" — دقة: ${Math.round(confidence * 100)}%`
      }

      micPassed.value = true
      micTesting.value = false

      stream
        .getTracks()
        .forEach(t => t.stop())
    }

    recognition.onerror = () => {

      micResult.value = {
        ok: false,
        message:
          '⚠️ لم يتم التقاط صوت. حاول مرة أخرى'
      }

      micTesting.value = false

      stream
        .getTracks()
        .forEach(t => t.stop())
    }

    recognition.onend = () => {

      if (
        !micPassed.value &&
        !micResult.value
      ) {

        micResult.value = {
          ok: false,
          message:
            '⚠️ لم يتم التقاط كلام. حاول بصوت أوضح'
        }

      }

      micTesting.value = false

      stream
        .getTracks()
        .forEach(t => t.stop())
    }

    setTimeout(() => {

      try {
        recognition.stop()
      } catch (e) {}

    }, 5000)

    recognition.start()

  } catch (e) {

    micResult.value = {
      ok: false,
      message:
        '❌ لا يمكن الوصول للميكروفون'
    }

    micTesting.value = false
  }
}


/* =========================
   SPEAKER TEST
========================= */

const testSpeaker = async () => {

  speakerTesting.value = true

  const testText =
    "Hello! I am Ahmad. Can you hear me clearly? Let's practice English together!"

  try {

    // Use Ahmad's ElevenLabs voice via backend
    const token =
      localStorage.getItem('token')

    const res =
      await fetch(
        `${API_URL}/tts`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            'Accept':
              'application/json',

            'Authorization':
              `Bearer ${token}`,
          },

          body:
            JSON.stringify({
              text: testText
            }),
        }
      )

    const json =
      await res.json()

    if (
      json.data?.audio &&
      json.data.audio_format === 'mp3'
    ) {

      const byteChars =
        atob(json.data.audio)

      const byteArray =
        new Uint8Array(
          byteChars.length
        )

      for (
        let i = 0;
        i < byteChars.length;
        i++
      ) {

        byteArray[i] =
          byteChars.charCodeAt(i)
      }

      const blob =
        new Blob(
          [byteArray],
          {
            type: 'audio/mpeg'
          }
        )

      const url =
        URL.createObjectURL(blob)

      const audio =
        new Audio(url)

      audio.onended = () => {

        showSpeakerConfirm.value = true
        speakerTesting.value = false

        URL.revokeObjectURL(url)
      }

      audio.onerror = () => {

        alert(
          '❌ خطأ في تشغيل الصوت'
        )

        speakerTesting.value = false
      }

      audio.play().catch(() => {

        alert(
          '❌ خطأ في تشغيل الصوت'
        )

        speakerTesting.value = false
      })

      return
    }

    // No audio returned
    alert(
      '❌ لم يتم استلام الصوت — تأكد من تشغيل Laragon وعمل Restart'
    )

    speakerTesting.value = false

  } catch (e) {

    console.error(
      'TTS Error:',
      e
    )

    alert(
      '❌ لا يمكن الاتصال بالسيرفر — تأكد من تشغيل Laragon'
    )

    speakerTesting.value = false
  }
}


/* =========================
   GO TO SESSION
========================= */

const goToSession = () => {

  router.push(
    `/session/${sessionId}`
  )
}

</script>


<style scoped>

/* =========================
   PAGE
========================= */

.check-page {
  min-height: 100vh;
  height: 100vh;
  background: #f7faff;

  color: #102a43;

  direction: ltr;

  overflow-x: hidden;
  overflow-y: auto;
}


/* =========================
   TOP BAR
========================= */

.top-bar {
  height: 78px;

  padding: 0 5%;

  background: #102a43;

  display: flex;

  align-items: center;

  justify-content: space-between;

  box-sizing: border-box;

  position: relative;

  z-index: 20;
}


/* =========================
   STUDENT AREA
========================= */

.student-area {
  display: flex;

  align-items: center;

  gap: 12px;
}


.student-badge {
  display: flex;

  align-items: center;

  gap: 8px;
}


.student-icon {
  width: 36px;
  height: 36px;

  border-radius: 11px;

  background:
    rgba(255,255,255,0.10);

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 17px;
}


.student-info {
  display: flex;

  flex-direction: column;

  gap: 1px;
}


.student-label {
  color: #cbd5e1;

  font-size: 9px;

  font-weight: 500;
}


.student-info strong {
  color: #ffffff;

  font-size: 12px;

  font-weight: 700;

  direction: ltr;
}


.logout-btn {
  border:
    1px solid
    rgba(255,255,255,0.25);

  background:
    rgba(255,255,255,0.08);

  color: #ffffff;

  border-radius: 9px;

  padding: 8px 17px;

  font-size: 12px;

  font-weight: 600;

  cursor: pointer;

  transition: 0.2s ease;
}


.logout-btn:hover {
  background:
    rgba(255,255,255,0.16);

  border-color:
    rgba(255,255,255,0.35);
}


/* =========================
   BRAND
========================= */

.brand {
  text-align: right;
}


.brand-name {
  font-size: 21px;

  font-weight: 800;

  letter-spacing: -0.5px;

  color: #ffffff;
}


.brand-tagline {
  font-size: 9px;

  color: #cbd5e1;

  font-weight: 500;
}


/* =========================
   MAIN
========================= */

.check-content {
  min-height:
    calc(100vh - 78px);

  position: relative;

  display: flex;

  align-items: center;

  padding:
    65px 5% 75px;

  box-sizing: border-box;
}


/* =========================
   BACKGROUND
========================= */

.bg-circle {
  position: absolute;

  border-radius: 50%;

  pointer-events: none;

opacity: 1;
}


.bg-circle-one {
  width: 420px;
  height: 420px;

right: 37%;
  top: 20%;

  border:
    2px solid
  rgba(96,165,250,0.18);
  }


.bg-circle-one::before,
.bg-circle-one::after {
  content: "";

  position: absolute;

  border-radius: 50%;

  border:
    2px solid
rgba(59,130,246,0.10);
}


.bg-circle-one::before {
  inset: 45px;
}


.bg-circle-one::after {
  inset: 95px;

  background:
    rgba(37,99,235,0.025);
}


.bg-circle-two {
  width: 190px;
  height: 190px;

right: calc(37% + 115px);
  top: calc(20% + 115px);

  background:
    rgba(37,99,235,0.025);
}


.bg-line {
  position: absolute;

  left: -5%;

  width: 110%;

  height: 70px;

  background:
    rgba(59,130,246,0.30);;

  transform: rotate(-17deg);

  pointer-events: none;
}


.bg-line-one {
  top: 48%;
}


.bg-line-two {
  top: 67%;

  background:
    rgba(96,165,250,0.16);;

  opacity: 1;
}


/* =========================
   LAYOUT
========================= */

.check-layout {
  width: 100%;
  max-width: 1500px;

  margin: 0 auto;

  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    540px;

  gap: 90px;

  align-items: center;

  position: relative;

  z-index: 2;
}


/* =========================
   LEFT SECTION
========================= */

.intro-section {
  max-width: 650px;

  justify-self: start;

transform: none;
  zoom: 1;

}


.intro-eyebrow {
  display: inline-block;

  color: #2563eb;

  font-size: 13px;

  font-weight: 800;

  letter-spacing: 1.8px;

  margin-bottom: 20px;
}


.intro-title {
  margin: 0;

  font-size:
    clamp(
      48px,
      5vw,
      72px
    );

  line-height: 0.98;

  letter-spacing: -3px;

  font-weight: 800;

  color: #102a43;
}


.intro-title span {
  display: block;

  color: #2563eb;

  margin-top: 8px;
}


.intro-description {
  max-width: 570px;

  margin:
    28px 0 38px;

  color: #526b84;

  font-size: 17px;

  line-height: 1.7;
}


/* =========================
   FEATURES
========================= */

.feature-item {
  display: flex;

  align-items: center;

  gap: 18px;

  margin-bottom: 23px;
}


.feature-icon {
  width: 58px;
  height: 58px;

  flex-shrink: 0;

  border-radius: 15px;

  background: #e5efff;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 25px;
}


.feature-text {
  display: flex;

  flex-direction: column;

  gap: 4px;
}


.feature-text strong {
  color: #102a43;

  font-size: 17px;

  font-weight: 750;
}


.feature-text span {
  color: #698096;

  font-size: 14px;
}


/* =========================
   FOOTER
========================= */

.intro-footer {
  display: flex;

  align-items: center;

  gap: 12px;

  margin-top: 42px;

  color: #7f94aa;

  font-size: 14px;

  font-style: italic;
}


.footer-line {
  width: 28px;
  height: 2px;

  background: #6fa1ff;

  border-radius: 10px;
}


/* =========================
   CARD
========================= */

.check-card {
  width: 100%;
  transform: none;

  background: #ffffff;

  border:
    1px solid #e3ebf5;

  border-radius: 25px;

  padding: 38px;

  box-sizing: border-box;

  box-shadow:
    0 20px 55px
    rgba(36,75,120,0.10);

  position: relative;
}


/* =========================
   CARD HEADER
========================= */

.card-icon {
  width: 58px;
  height: 58px;

  border-radius: 15px;

  background: #e8f0ff;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 25px;

  margin-bottom: 19px;
}


.card-title {
  margin: 0;

  color: #102a43;

  font-size: 29px;

  font-weight: 800;

  letter-spacing: -1px;
}


.card-subtitle {
  margin:
    10px 0 25px;

  color: #647b92;

  font-size: 14px;

  line-height: 1.6;
}


/* =========================
   CHECK ITEMS
========================= */

.check-item {
  min-height: 72px;

  padding: 12px 13px;

  box-sizing: border-box;

  border:
    1px solid #e2eaf4;

  border-radius: 15px;

  display: flex;

  align-items: center;

  gap: 12px;

  margin-bottom: 12px;

  transition: 0.25s ease;

  background: #fbfdff;
}


.check-item.active {
  border-color: #8bb4ff;

  background: #f5f9ff;
}


.check-item.success-item {
  border-color: #bdebcf;

  background: #f4fcf7;
}


.check-item.disabled {
  opacity: 0.55;
}


.student-item {
  background: #f8fbff;
}


/* =========================
   ITEM ICON
========================= */

.item-icon {
  width: 44px;
  height: 44px;

  flex-shrink: 0;

  border-radius: 12px;

  background: #eaf2ff;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 19px;
}


.mic-icon {
  background: #e8f7ed;
}


.speaker-icon {
  background: #eaf2ff;
}


/* =========================
   ITEM CONTENT
========================= */

.item-content {
  min-width: 0;

  flex: 1;

  display: flex;

  flex-direction: column;

  gap: 4px;
}


.item-content strong {
  color: #102a43;

  font-size: 14px;

  font-weight: 750;
}


.item-content span {
  color: #72869a;

  font-size: 11px;

  line-height: 1.4;

  word-break: break-word;
}


/* =========================
   STATUS
========================= */

.status-badge {
  width: 28px;
  height: 28px;

  border-radius: 50%;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 15px;

  flex-shrink: 0;
}


.status-badge.success {
  color: white;

  background: #22a65a;
}


/* =========================
   TEST BUTTON
========================= */

.test-btn {
  min-width: 72px;

  padding: 9px 13px;

  border:
    1px solid #4d85ff;

  background: white;

  color: #2563eb;

  border-radius: 10px;

  font-size: 12px;

  font-weight: 700;

  cursor: pointer;

  transition: 0.2s ease;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 5px;
}


.test-btn:hover:not(:disabled) {
  background: #2563eb;

  color: white;
}


.test-btn:disabled {
  cursor: not-allowed;

  opacity: 0.55;
}


.test-btn.recording {
  background: #dc2626;

  border-color: #dc2626;

  color: white;

  animation:
    pulse-red 1s infinite;
}


.test-btn.playing {
  background: #2563eb;

  border-color: #2563eb;

  color: white;
}


.test-btn.passed {
  background: #20a45a;

  border-color: #20a45a;

  color: white;
}


@keyframes pulse-red {

  0%,
  100% {
    box-shadow:
      0 0 0 0
      rgba(220,38,38,0.25);
  }

  50% {
    box-shadow:
      0 0 0 8px
      rgba(220,38,38,0);
  }

}


/* =========================
   WAVEFORM
========================= */

.waveform-test {
  height: 28px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 3px;

  margin:
    -4px 0 10px;
}


.wave-bar {
  width: 4px;

  background: #2563eb;

  border-radius: 5px;

  animation:
    wave
    0.8s
    ease-in-out
    infinite alternate;
}


@keyframes wave {

  0% {
    height: 5px;
  }

  100% {
    height: 25px;
  }

}


/* =========================
   MIC RESULT
========================= */

.mic-result {
  margin:
    -2px 0 12px;

  padding: 8px 12px;

  border-radius: 9px;

  font-size: 11px;

  text-align: center;

  direction: ltr;
}


.mic-result.ok {
  background: #f0fdf4;

  color: #159447;
}


.mic-result.fail {
  background: #fef2f2;

  color: #dc2626;
}


/* =========================
   SPEAKER CONFIRM
========================= */

.speaker-confirm {
  display: flex;

  gap: 8px;

  margin:
    -2px 0 12px;
}


.confirm-yes,
.confirm-no {
  flex: 1;

  padding: 9px;

  border: none;

  border-radius: 9px;

  font-size: 11px;

  font-weight: 700;

  cursor: pointer;
}


.confirm-yes {
  background: #20a45a;

  color: white;
}


.confirm-no {
  background: #f1f5f9;

  color: #64748b;
}


/* =========================
   READY STATUS
========================= */

.ready-status {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  margin:
    20px 0 14px;

  color: #91a2b4;

  font-size: 12px;

  font-weight: 600;
}


.ready-status.ready {
  color: #159447;
}


.ready-dot {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: #cbd5e1;
}


.ready-status.ready .ready-dot {
  background: #20a45a;

  box-shadow:
    0 0 0 4px
    rgba(32,164,90,0.10);
}


/* =========================
   START SESSION
========================= */

.start-session-btn {
  width: 100%;

  padding: 14px 20px;

  border: none;

  border-radius: 12px;

  background:
    linear-gradient(
      135deg,
      #2f6df6,
      #2563eb
    );

  color: white;

  font-size: 14px;

  font-weight: 750;

  cursor: pointer;

  transition: 0.25s ease;
}


.start-session-btn:hover:not(:disabled) {
  transform:
    translateY(-2px);

  box-shadow:
    0 10px 22px
    rgba(37,99,235,0.22);
}


.start-session-btn:disabled {
  opacity: 0.45;

  cursor: not-allowed;

  box-shadow: none;
}


.arrow {
  margin-left: 8px;

  font-size: 17px;
}


/* =========================
   CARD FOOTER
========================= */

.card-footer {
  margin:
    16px 0 0;

  text-align: center;

  color: #9aabba;

  font-size: 11px;
}


/* =========================
   RESPONSIVE SYSTEM
   Desktop → Laptop → Tablet → Mobile
   ========================= */

/* =========================================================
   LAPTOP
   Keep the two-column desktop design, but remove the
   large fixed transforms that can push content off-screen.
   ========================================================= */
@media (max-width: 1200px) {

  .top-bar {
    padding: 0 32px;
  }

  .check-content {
    padding: 55px 32px 65px;
  }

  .check-layout {
    width: 100%;
    max-width: 1100px;
    grid-template-columns: minmax(0, 1fr) 470px;
    gap: 45px;
  }

  .intro-section {
    max-width: 600px;
    transform: none;
    zoom: 1;
  }

  .intro-title {
    font-size: clamp(46px, 5vw, 60px);
    letter-spacing: -2.4px;
  }

  .intro-description {
    max-width: 520px;
    font-size: 16px;
  }

  .check-card {
    transform: none;
    padding: 30px;
  }

  /*
    Keep the decorative circles behind the content while
    bringing them slightly toward the center.
  */
  .bg-circle-one {
    right: 28%;
  }

  .bg-circle-two {
    right: 37%;
  }
}


/* =========================================================
   TABLET
   Two columns become one column.
   Order:
   Intro → System Check Card
   ========================================================= */
@media (max-width: 900px) {

  .top-bar {
    height: 70px;
    padding: 0 24px;
  }

  .brand-name {
    font-size: 19px;
  }

  .brand-tagline {
    font-size: 8px;
  }

  .student-area {
    gap: 10px;
  }

  .student-icon {
    width: 33px;
    height: 33px;
    font-size: 15px;
  }

  .logout-btn {
    padding: 7px 12px;
    font-size: 11px;
  }

  .check-content {
    min-height: calc(100vh - 70px);
    padding: 45px 24px 60px;
    display: block;
  }

  .check-layout {
    width: 100%;
    max-width: 720px;
    display: flex;
    flex-direction: column;
    gap: 42px;
    align-items: stretch;
  }

  .intro-section {
    width: 100%;
    max-width: 650px;
    margin: 0 auto;
    transform: none;
    zoom: 1;
  }

  .intro-eyebrow {
    font-size: 12px;
    margin-bottom: 16px;
  }

  .intro-title {
    font-size: clamp(42px, 6vw, 56px);
    line-height: 1;
    letter-spacing: -2px;
  }

  .intro-title span {
    margin-top: 7px;
  }

  .intro-description {
    max-width: 560px;
    margin: 22px 0 30px;
    font-size: 15px;
  }

  .feature-item {
    margin-bottom: 17px;
  }

  .intro-footer {
    margin-top: 26px;
  }

  .check-card {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    transform: none;
    padding: 30px;
    border-radius: 22px;
  }

  .bg-circle-one {
    right: -70px;
    top: 35%;
  }

  .bg-circle-two {
    right: 20px;
    top: 45%;
  }

  .bg-line {
    opacity: 0.28;
  }
}


/* =========================================================
   MOBILE
   Content becomes a comfortable vertical flow.
   ========================================================= */
@media (max-width: 600px) {

  .top-bar {
    height: 68px;
    padding: 0 16px;
  }

  .brand-name {
    font-size: 17px;
  }

  .brand-tagline {
    display: none;
  }

  .student-area {
    gap: 8px;
  }

  .student-badge {
    gap: 6px;
  }

  .student-icon {
    width: 31px;
    height: 31px;
    border-radius: 10px;
    font-size: 14px;
  }

  .student-info {
    display: none;
  }

  .logout-btn {
    padding: 7px 10px;
    font-size: 10px;
  }

  .check-content {
    min-height: calc(100vh - 68px);
    padding: 30px 16px 45px;
    display: block;
  }

  .check-layout {
    width: 100%;
    max-width: none;
    gap: 30px;
  }

  .intro-section {
    width: 100%;
    max-width: none;
    margin: 0;
    transform: none;
    zoom: 1;
  }

  .intro-eyebrow {
    font-size: 10px;
    letter-spacing: 1.4px;
    margin-bottom: 13px;
  }

  .intro-title {
    font-size: clamp(34px, 10vw, 42px);
    line-height: 1.03;
    letter-spacing: -1.6px;
  }

  .intro-title span {
    margin-top: 6px;
  }

  .intro-description {
    max-width: none;
    margin: 18px 0 25px;
    font-size: 13px;
    line-height: 1.65;
  }

  .feature-item {
    gap: 13px;
    margin-bottom: 14px;
  }

  .feature-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    font-size: 19px;
  }

  .feature-text {
    min-width: 0;
  }

  .feature-text strong {
    font-size: 13px;
    line-height: 1.25;
  }

  .feature-text span {
    font-size: 10px;
    line-height: 1.35;
  }

  .intro-footer {
    margin-top: 22px;
    gap: 9px;
    font-size: 11px;
  }

  .footer-line {
    width: 22px;
  }

  .check-card {
    width: 100%;
    max-width: none;
    margin: 0;
    transform: none;
    padding: 22px 18px;
    border-radius: 18px;
  }

  .card-icon {
    width: 50px;
    height: 50px;
    border-radius: 13px;
    font-size: 22px;
    margin-bottom: 16px;
  }

  .card-title {
    font-size: 25px;
    letter-spacing: -0.7px;
  }

  .card-subtitle {
    margin: 8px 0 20px;
    font-size: 12px;
    line-height: 1.55;
  }

  .check-item {
    min-height: 66px;
    gap: 9px;
    padding: 9px 10px;
    margin-bottom: 10px;
  }

  .item-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    font-size: 17px;
  }

  .item-content {
    gap: 3px;
  }

  .item-content strong {
    font-size: 12px;
  }

  .item-content span {
    font-size: 10px;
    line-height: 1.35;
  }

  .status-badge {
    width: 25px;
    height: 25px;
    font-size: 13px;
  }

  .test-btn {
    min-width: 68px;
    padding: 8px 9px;
    font-size: 10px;
  }

  .btn-icon {
    font-size: 12px;
  }

  .waveform-test {
    height: 24px;
    gap: 2px;
  }

  .wave-bar {
    width: 3px;
  }

  .mic-result {
    font-size: 10px;
    padding: 7px 9px;
  }

  .speaker-confirm {
    flex-direction: column;
    gap: 7px;
  }

  .confirm-yes,
  .confirm-no {
    width: 100%;
    padding: 9px;
    font-size: 10px;
  }

  .ready-status {
    margin: 16px 0 12px;
    font-size: 11px;
  }

  .start-session-btn {
    padding: 13px 16px;
    font-size: 13px;
  }

  .card-footer {
    margin-top: 13px;
    font-size: 10px;
  }

  /*
    Decorative elements stay behind the content.
    They are intentionally subtle on phones so they
    don't compete with the system-check controls.
  */
  .bg-circle-one {
    width: 300px;
    height: 300px;
    right: -145px;
    top: 48%;
    opacity: 0.35;
  }

  .bg-circle-two {
    width: 140px;
    height: 140px;
    right: -55px;
    top: 55%;
    opacity: 0.25;
  }

  .bg-line {
    opacity: 0.18;
  }
}


/* =========================================================
   SMALL MOBILE
   Extra protection for narrow phones.
   ========================================================= */
@media (max-width: 380px) {

  .top-bar {
    padding: 0 12px;
  }

  .brand-name {
    font-size: 15px;
  }

  .logout-btn {
    padding: 6px 9px;
    font-size: 9px;
  }

  .check-content {
    padding-left: 12px;
    padding-right: 12px;
  }

  .intro-title {
    font-size: 32px;
    letter-spacing: -1.3px;
  }

  .intro-description {
    font-size: 12px;
  }

  .feature-item {
    gap: 10px;
  }

  .feature-icon {
    width: 40px;
    height: 40px;
    font-size: 17px;
  }

  .feature-text strong {
    font-size: 12px;
  }

  .feature-text span {
    font-size: 9px;
  }

  .check-card {
    padding: 20px 14px;
  }

  .check-item {
    gap: 7px;
    padding: 8px;
  }

  .item-icon {
    width: 37px;
    height: 37px;
    font-size: 16px;
  }

  .item-content strong {
    font-size: 11px;
  }

  .item-content span {
    font-size: 9px;
  }

  .test-btn {
    min-width: 60px;
    padding: 7px 7px;
    font-size: 9px;
  }

  .card-title {
    font-size: 23px;
  }

  .card-subtitle {
    font-size: 11px;
  }
}

</style>