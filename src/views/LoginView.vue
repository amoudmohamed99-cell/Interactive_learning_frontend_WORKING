<template>
  <div class="login-page">
    <div class="login-layout">

    

      <!-- LEFT SIDE -->
      <section class="login-intro">

        <div class="brand">
          <div class="brand-mark">💬</div>

          <div>
            <div class="brand-name">
              <span>Speak</span>Better
            </div>

            <div class="brand-tagline">
              Practice · Improve · Be Confident
            </div>
          </div>
        </div>

        <div class="intro-content">

          <h1>
            Practice English
            <span>Through Real-Life</span>
            Conversations
          </h1>

          <p>
            Your AI speaking partner is ready
            to practice with you.
          </p>

          <div class="feature-list">

            <div class="feature-item">
              <div class="feature-icon">🎙️</div>

              <div class="feature-text">
                <strong>Real-Life Conversations</strong>
                <span>Speak naturally</span>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-icon">📊</div>

              <div class="feature-text">
                <strong>Track Your Progress</strong>
                <span>See your improvement</span>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-icon">📖</div>

              <div class="feature-text">
                <strong>Practical Scenarios</strong>
                <span>Practice daily situations</span>
              </div>
            </div>

          </div>
        </div>

      </section>

      

      <!-- RIGHT SIDE -->
      <section class="login-area">

        <div class="login-card">

          <div class="card-icon">🎓</div>

          <h2>Welcome back!</h2>

          <p class="card-subtitle">
            Enter your student code to continue
          </p>

          <form @submit.prevent="handleLogin">

            <label for="student-code">
              Student Code
            </label>

            <div class="input-wrapper">

              <span class="input-icon">👤</span>

              <input
                id="student-code"
                v-model="code"
                type="text"
                placeholder="Enter your student code"
                :disabled="loading"
                maxlength="8"
                dir="ltr"
                autofocus
              />

            </div>

            <div
              v-if="error"
              class="error-msg"
            >
              {{ error }}
            </div>

            <button
              type="submit"
              :disabled="loading || !code.trim()"
            >

              <span
                v-if="loading"
                class="spinner"
              ></span>

              <span v-else>
                Continue
                <span class="arrow">→</span>
              </span>

            </button>

          </form>

          <div class="voice-note">

            <div class="voice-icon">
              🎙️
            </div>

            <div>
              <span>Your AI speaking partner</span>
              <strong>is ready when you are!</strong>
            </div>

          </div>

        </div>

        <div class="bottom-note">
          Small steps. Big progress.
        </div>

      </section>

    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../api'

const router = useRouter()

const code = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    await login(code.value.trim())
    router.push('/welcome')
  } catch (e) {
    error.value =
      e.response?.data?.message ||
      'The student code is incorrect. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>


<style scoped>
.login-page {
  min-height: 100vh;
  width: 100%;
  background: #f7fbff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  box-sizing: border-box;

  position: relative;
  overflow: hidden;
  isolation: isolate;
}

.login-page::before {
  content: "";
  position: absolute;
  left: 55%;
  top: 50%;
  width: 460px;
  height: 460px;
  transform: translate(-50%, -50%);
  border-radius: 50%;

background:
  radial-gradient(
    circle at center,
    rgba(96, 165, 250, 0.12) 0%,
    rgba(147, 197, 253, 0.07) 22%,
    rgba(219, 234, 254, 0.05) 38%,
    transparent 58%
  ),
  radial-gradient(
    circle,
    rgba(255, 255, 255, 0.98) 0 18%,
    transparent 18.5% 35%,
    rgba(96, 165, 250, 0.10) 35.5% 36.5%,
    transparent 37% 52%,
    rgba(96, 165, 250, 0.13) 52.5% 53.5%,
    transparent 54% 68%,
    rgba(147, 197, 253, 0.10) 68.5% 69.5%,
    transparent 70%
  );

  box-shadow:
    0 30px 90px rgba(37, 99, 235, 0.10),
    inset 0 0 70px rgba(255, 255, 255, 0.8);

  pointer-events: none;
  z-index: 0;
}

.login-page::after {
  content: "";
  position: absolute;
  left: 55%;
  top: 50%;
  width: 340px;
  height: 340px;
  transform: translate(-50%, -50%);
  border-radius: 50%;

  background:
    radial-gradient(
      circle at center,
      rgba(37, 99, 235, 0.18) 0%,
      rgba(59, 130, 246, 0.12) 25%,
      rgba(147, 197, 253, 0.07) 45%,
      transparent 68%
    );

  border: 1px solid rgba(37, 99, 235, 0.10);

  box-shadow:
    0 0 0 28px rgba(37, 99, 235, 0.035),
    0 0 0 58px rgba(96, 165, 250, 0.025),
    0 25px 70px rgba(37, 99, 235, 0.10);

  pointer-events: none;
  z-index: 0;
}

.login-layout {
  width: 100%;
  max-width: none;
  min-height: 680px;
  display: grid;
  grid-template-columns: 1.25fr 0.75fr;
  gap: 110px;
  align-items: center;
  direction: ltr;
  padding: 0 20px;
  box-sizing: border-box;
  
}


/* =========================
   LEFT SIDE
========================= */

.login-intro {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 20px 0;
transform: translateX(120px);}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 70px;
}

.brand-mark {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #dbeafe;
  font-size: 22px;
}

.brand-name {
  color: #172b4d;
  font-size: 25px;
  font-weight: 800;
  line-height: 1;
}

.brand-name span {
  color: #2563eb;
}

.brand-tagline {
  margin-top: 6px;
  color: #7b8ba3;
  font-size: 11px;
  font-weight: 500;
}


/* INTRO CONTENT */

.intro-content {
  max-width: 680px;
}

.intro-content h1 {
  margin: 0;
  color: #172b4d;
font-size: clamp(48px, 4.8vw, 70px);
  line-height: 1.08;
  letter-spacing: -2px;
  font-weight: 800;
}

.intro-content h1 span {
  display: block;
  color: #2563eb;
}

.intro-content > p {
  margin: 26px 0 38px;
  max-width: 480px;
  color: #64748b;
  font-size: 17px;
  line-height: 1.7;
}


/* FEATURES */

.feature-list {
  display: flex;
  flex-direction: column;
gap: 26px;
  width: 100%;
  max-width: 600px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 18px;
}

.feature-icon {
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(160, 185, 215, 1);
  font-size: 17px;
}

.feature-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.feature-text strong {
  color: #000000;
font-size: 15px;
  font-weight: 700;
}

.feature-text span {
  color: #64748b;
font-size: 12px;
}


/* =========================
   RIGHT SIDE
========================= */

.login-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.login-card {
  width: 100%;
max-width: 500px;
  background: #ffffff;
  border-radius: 24px;
  padding: 46px 44px;
  box-sizing: border-box;
  box-shadow: 0 20px 60px rgba(31, 55, 86, 0.10);
  border: 1px solid rgba(219, 234, 254, 0.8);
}

.card-icon {
  width: 58px;
  height: 58px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eaf2ff;
  font-size: 27px;
  margin-bottom: 24px;
}

.login-card h2 {
  margin: 0;
  color: #172b4d;
  font-size: 30px;
  font-weight: 800;
}

.card-subtitle {
  margin: 9px 0 30px;
  color: #7b8ba3;
  font-size: 14px;
  line-height: 1.5;
}


/* FORM */

.login-card form {
  display: flex;
  flex-direction: column;
}

.login-card label {
  margin-bottom: 9px;
  color: #334e68;
  font-size: 13px;
  font-weight: 700;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 17px;
  z-index: 1;
}

.input-wrapper input {
  width: 100%;
  height: 54px;
  padding: 0 16px 0 45px;
  box-sizing: border-box;
  border: 1.5px solid #dbe4ee;
  border-radius: 13px;
  background: #ffffff;
  color: #172b4d;
  font-size: 16px;
  outline: none;
  transition: 0.2s ease;
}

.input-wrapper input::placeholder {
  color: #a0aec0;
}

.input-wrapper input:focus {
  border-color: #6b9df8;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
}


/* BUTTON */

.login-card button {
  width: 100%;
  height: 54px;
  margin-top: 20px;
  border: none;
  border-radius: 13px;
  background: #2563eb;
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s ease;
}

.login-card button:hover:not(:disabled) {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.login-card button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.arrow {
  margin-left: 8px;
  font-size: 18px;
}


/* ERROR */

.error-msg {
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #fef2f2;
  color: #dc2626;
  font-size: 13px;
}


/* LOADING */

.spinner {
  width: 19px;
  height: 19px;
  border: 3px solid rgba(255, 255, 255, 0.35);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}


/* VOICE NOTE */

.voice-note {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-top: 28px;
  padding: 13px 14px;
  border-radius: 13px;
  background: #f7faff;
  border: 1px solid #e5eefb;
}

.voice-icon {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eaf2ff;
  font-size: 15px;
}

.voice-note div:last-child {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.voice-note span {
  color: #7b8ba3;
  font-size: 10px;
}

.voice-note strong {
  color: #334e68;
  font-size: 11px;
}


/* BOTTOM NOTE */

.bottom-note {
  margin-top: 18px;
  color: #94a3b8;
  font-size: 11px;
  text-align: center;
}


/* =========================
   RESPONSIVE SYSTEM
   Desktop → Laptop → Tablet → Mobile
   ========================= */

/* =========================================================
   LAPTOP
   Keep the original two-column design, but remove the
   fixed positioning that can cause horizontal overflow.
   ========================================================= */
@media (max-width: 1250px) {

  .login-page {
    padding: 28px;
  }

  .login-layout {
    grid-template-columns: minmax(0, 1.12fr) minmax(360px, 0.88fr);
    gap: 60px;
    min-height: 640px;
    padding: 0 10px;
  }

  .login-intro {
    transform: none;
  }

  .brand {
    margin-bottom: 52px;
  }

  .intro-content {
    max-width: 620px;
  }

  .intro-content h1 {
    font-size: clamp(44px, 5vw, 62px);
  }

  .intro-content > p {
    font-size: 16px;
    max-width: 460px;
  }

  .feature-list {
    max-width: 560px;
    gap: 22px;
  }

  .login-card {
    max-width: 460px;
    padding: 40px 36px;
  }
}


/* =========================================================
   TABLET
   The two-column layout becomes one column.
   Content order:
   Intro → Login Card
   ========================================================= */
@media (max-width: 900px) {

  .login-page {
    min-height: 100vh;
    padding: 32px 24px;
    overflow-x: hidden;
    overflow-y: auto;
    align-items: flex-start;
  }

  .login-layout {
    width: 100%;
    max-width: 720px;
    min-height: auto;
    grid-template-columns: 1fr;
    gap: 42px;
    padding: 20px 0 10px;
    margin: 0 auto;
  }

  .login-intro {
    width: 100%;
    align-items: center;
    text-align: center;
    padding: 10px 0;
    transform: none;
  }

  .brand {
    margin-bottom: 34px;
  }

  .intro-content {
    width: 100%;
    max-width: 620px;
  }

  .intro-content h1 {
    font-size: clamp(42px, 6vw, 58px);
    line-height: 1.08;
  }

  .intro-content > p {
    margin: 20px auto 30px;
    max-width: 520px;
    font-size: 16px;
  }

  .feature-list {
    width: 100%;
    max-width: 520px;
    gap: 20px;
    align-items: stretch;
    text-align: left;
  }

  .feature-item {
    gap: 16px;
  }

  .login-area {
    width: 100%;
    max-width: 520px;
    margin: 0 auto;
  }

  .login-card {
    width: 100%;
    max-width: none;
    padding: 40px 36px;
  }

  .bottom-note {
    margin-bottom: 10px;
  }
}


/* =========================================================
   MOBILE
   The layout stays stacked, and every element becomes
   fluid so it fits narrow screens without horizontal scroll.
   ========================================================= */
@media (max-width: 600px) {

  .login-page {
    min-height: 100svh;
    padding: 22px 16px 30px;
    align-items: flex-start;
  }

  .login-layout {
    width: 100%;
    max-width: 100%;
    min-height: auto;
    gap: 30px;
    padding: 0;
  }

  .login-intro {
    padding: 4px 0;
  }

  .brand {
    width: 100%;
    justify-content: center;
    gap: 10px;
    margin-bottom: 28px;
  }

  .brand-mark {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    font-size: 20px;
  }

  .brand-name {
    font-size: 23px;
  }

  .brand-tagline {
    font-size: 10px;
  }

  .intro-content {
    width: 100%;
  }

  .intro-content h1 {
    font-size: clamp(34px, 9vw, 42px);
    line-height: 1.08;
    letter-spacing: -1.2px;
  }

  .intro-content h1 span {
    white-space: normal;
  }

  .intro-content > p {
    margin: 18px auto 26px;
    max-width: 420px;
    font-size: 14px;
    line-height: 1.6;
  }

  /*
    Same responsive principle as Sessions:
    desktop/tablet = normal list
    narrow mobile = comfortably stacked items
  */
  .feature-list {
    width: 100%;
    max-width: none;
    gap: 12px;
  }

  .feature-item {
    width: 100%;
    box-sizing: border-box;
    gap: 13px;
    padding: 2px 0;
  }

  .feature-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    font-size: 16px;
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

  .login-area {
    width: 100%;
    max-width: none;
  }

  .login-card {
    width: 100%;
    max-width: none;
    padding: 30px 20px;
    border-radius: 20px;
  }

  .card-icon {
    width: 52px;
    height: 52px;
    border-radius: 15px;
    font-size: 24px;
    margin-bottom: 20px;
  }

  .login-card h2 {
    font-size: 25px;
  }

  .card-subtitle {
    margin: 8px 0 24px;
    font-size: 13px;
  }

  .login-card label {
    font-size: 12px;
  }

  .input-wrapper input {
    height: 52px;
    font-size: 16px;
    padding-left: 43px;
  }

  .input-icon {
    left: 14px;
    font-size: 16px;
  }

  .login-card button {
    height: 52px;
    font-size: 15px;
  }

  .voice-note {
    margin-top: 22px;
    padding: 11px 12px;
  }

  .voice-icon {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }

  .voice-note span {
    font-size: 9px;
  }

  .voice-note strong {
    font-size: 10px;
  }

  .bottom-note {
    margin-top: 14px;
    margin-bottom: 4px;
    font-size: 10px;
  }
}


/* =========================================================
   SMALL MOBILE
   Extra protection for very narrow phones.
   ========================================================= */
@media (max-width: 380px) {

  .login-page {
    padding: 18px 12px 26px;
  }

  .login-layout {
    gap: 26px;
  }

  .brand {
    margin-bottom: 24px;
  }

  .brand-mark {
    width: 38px;
    height: 38px;
    font-size: 18px;
  }

  .brand-name {
    font-size: 21px;
  }

  .brand-tagline {
    font-size: 9px;
  }

  .intro-content h1 {
    font-size: 32px;
    letter-spacing: -1px;
  }

  .intro-content > p {
    font-size: 13px;
  }

  .feature-item {
    gap: 11px;
  }

  .feature-icon {
    width: 40px;
    height: 40px;
  }

  .feature-text strong {
    font-size: 12px;
  }

  .feature-text span {
    font-size: 9px;
  }

  .login-card {
    padding: 26px 16px;
  }

  .login-card h2 {
    font-size: 23px;
  }

  .card-subtitle {
    font-size: 12px;
  }

  .voice-note {
    gap: 8px;
  }
}


/* =========================================================
   LARGE FLOWING WAVE
   ========================================================= */

.login-page::after {
  content: "";
  position: absolute;

  left: -25%;
  top: 48%;

  width: 155%;
  height: 250px;

  border-radius: 50%;

  border-top: 75px solid rgba(59, 130, 246, 0.13);
  border-bottom: 35px solid rgba(96, 165, 250, 0.07);

  transform: rotate(-17deg);

  box-shadow:
    0 -18px 35px rgba(37, 99, 235, 0.06),
    0 22px 45px rgba(96, 165, 250, 0.05);

  pointer-events: none;
  z-index: 1;
}


/* Keep all actual content above the wave */

.login-layout {
  position: relative;
  z-index: 2;
}

</style>