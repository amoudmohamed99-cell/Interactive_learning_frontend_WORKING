<template>
  <div class="welcome-page">

    <!-- ================= HEADER ================= -->
    <header class="welcome-header">

      <div class="brand">
        <div class="brand-logo">
          <span class="brand-mark">●</span>
          <span>SpeakBetter</span>
        </div>

        <div class="brand-tagline">
          Real Conversations. A Brighter You.
        </div>
      </div>

      <nav class="main-nav">
        <button class="nav-item active">Home</button>

        <button
          class="nav-item"
          @click="goToScenarios"
        >
          Sessions
        </button>

        <button class="nav-item">Progress</button>
        <button class="nav-item">Tips</button>
        <button class="nav-item">About</button>
      </nav>

      <div class="header-actions">

        <div class="student-badge">
          <div class="student-icon">👤</div>

          <div class="student-info">
            <span>Student</span>
            <strong>{{ studentName }}</strong>
          </div>

          <span class="student-arrow">⌄</span>
        </div>

        <button
          class="logout-btn"
          @click="handleLogout"
        >
          <span class="logout-icon">↪</span>
          Log out
        </button>

      </div>

    </header>


    <!-- ================= HERO ================= -->
    <main class="hero">

      <!-- ================= LEFT TEXT ================= -->
      <section class="hero-content">

       <span class="eyebrow">
  AI-POWERED ENGLISH SPEAKING PRACTICE
</span>

<h1>
  Practice English
  <span>Through Real-Life</span>
  Conversations
</h1>

<p class="hero-description">
  Practice speaking with Ahmad, your AI-powered English coach.
</p>


        <!-- FEATURES -->
        <div class="features">

          <div class="feature">

            <div class="feature-icon">
              🎙️
            </div>

            <div class="feature-text">
<strong>Real-Life Conversations</strong>
              <span>Speak naturally</span>
            </div>

          </div>


          <div class="feature">

            <div class="feature-icon">
              📊
            </div>

            <div class="feature-text">
              <strong>Instant Feedback</strong>
              <span>See your improvement</span>
            </div>

          </div>


          <div class="feature">

            <div class="feature-icon">
              📖
            </div>

            <div class="feature-text">
              <strong>Build Speaking Confidence</strong>
<span>Practice daily situations</span>
            </div>

          </div>

        </div>


        <!-- BUTTONS -->
        <div class="hero-actions">

          <button
            class="primary-btn"
            @click="goToScenarios"
          >
            Start Speaking
            <span>→</span>
          </button>

          <button
            class="secondary-btn"
            @click="goToScenarios"
          >
            View Sessions
          </button>

        </div>


        <!-- NOTE -->
        <div class="hero-note">
          <span class="note-arrow">↗</span>

          <em>
            Let's speak<br>
            a better you!
          </em>
        </div>

      </section>


      <!-- ================= RIGHT AHMAD ================= -->
      <section class="avatar-section">

        <div class="avatar-stage">

          <!-- SOFT BACKGROUND LIGHT -->
          <div class="stage-glow"></div>


          <!-- ================= ONLINE ================= -->
          <div class="online-card">

            <span class="online-dot"></span>

            <div>
              <strong>
                Ahmad is online
              </strong>

              <span>
                Ready to chat!
              </span>
            </div>

          </div>


          <!-- ================= SPEECH ================= -->
          <div class="speech-card">

            <strong>
              Hi! 👋
            </strong>

            <span>
              Let's practice<br>
              English together!
            </span>

          </div>


          <!-- ================= AHMAD ================= -->
          <div class="avatar-wrapper">

            <img
              src="/ahmad.png"
              alt="Ahmad"
              class="ahmad-avatar"
            />

          </div>


          <!-- ================= RIGHT FEATURES ================= -->
          <div class="feature-rail">

            <div class="rail-item">

              <span class="rail-icon">
                🎙️
              </span>

              <strong>
                Speak
              </strong>

            </div>


            <div class="rail-item">

              <span class="rail-icon">
                💬
              </span>

              <strong>
                Chat
              </strong>

            </div>


            <div class="rail-item">

              <span class="rail-icon">
                📈
              </span>

              <strong>
                Improve
              </strong>

            </div>


            <div class="rail-item">

              <span class="rail-icon">
                📖
              </span>

              <strong>
                Learn
              </strong>

            </div>

          </div>


          <!-- ================= JOURNEY ================= -->
          <div class="journey-card">

            <div class="check-icon">
              ✓
            </div>

            <div class="journey-text">

              <strong>
                Your English Journey
              </strong>

              <strong>
                Starts Here
              </strong>

              <span>
                Small steps. Big progress.
              </span>

            </div>

          </div>

        </div>

      </section>

    </main>

  </div>
</template>


<script setup>

import { useRouter } from 'vue-router'
import { logout } from '../api'

const router = useRouter()

const student = JSON.parse(
  localStorage.getItem('student') || '{}'
)

const studentName =
  student.code || 'Student'


const goToScenarios = () => {
  router.push('/scenarios')
}


const handleLogout = async () => {

  await logout()

  router.push('/')

}

</script>


<style scoped>
.hero-content {
  animation: heroContentIn 0.7s ease-out both;
}

.avatar-section {
  animation: heroAvatarIn 0.8s ease-out 0.1s both;
}

@keyframes heroContentIn {
  from {
    opacity: 0;
    transform: translateY(14px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes heroAvatarIn {
  from {
    opacity: 0;
    transform: translateX(18px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes floatCard {
  0%, 100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-6px);
  }
}

/* =========================================================
   PAGE
========================================================= */

.welcome-page {

  width: 100%;
  min-height: 100vh;

overflow: visible;

  position: relative;

  color: #102a43;

  background:
    radial-gradient(
      circle at 70% 45%,
      rgba(210, 228, 252, 0.95),
      transparent 42%
    ),
    radial-gradient(
      circle at 25% 55%,
      rgba(236, 245, 255, 0.9),
      transparent 40%
    ),
    linear-gradient(
      135deg,
      #f7fbff 0%,
      #edf5ff 52%,
      #f7fbff 100%
    );

}


/* =========================================================
   HEADER
========================================================= */

.welcome-header {

  height: 78px;

  width: 100%;

  padding:
    0 5%;

  box-sizing: border-box;

  display: flex;

  align-items: center;

  justify-content: space-between;

 background: #102a43;

  backdrop-filter: blur(15px);

  border-bottom:
    1px solid
    rgba(148,163,184,0.12);

  position: relative;

  z-index: 50;

}


/* =========================================================
   BRAND
========================================================= */

.brand {

  display: flex;

  flex-direction: column;

  gap: 2px;

}


.brand-logo {

  display: flex;

  align-items: center;

  gap: 9px;

  color: #102a43;

  font-size: 24px;

  font-weight: 800;

  letter-spacing: -0.8px;

}


.brand-mark {

  width: 29px;
  height: 29px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 10px;

  background: #2563eb;

  color: white;

  font-size: 8px;

  box-shadow:
    0 5px 16px
    rgba(37,99,235,0.25);

}


.brand-tagline {

  padding-left: 38px;

  color: #94a3b8;

  font-size: 8px;

  letter-spacing: 0.35px;

}


/* =========================================================
   NAV
========================================================= */

.main-nav {

  height: 100%;

  display: flex;

  align-items: center;

  gap: 3px;

}


.nav-item {
  height: 100%;
  padding: 0 14px;
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}


.nav-item:hover {

  color: #2563eb;

}


.nav-item.active {
  color: #2563eb;
  font-weight: 700;
  background: #eff6ff;
  border-radius: 10px;
}


.nav-item.active::after {
  display: none;
}


/* =========================================================
   HEADER ACTIONS
========================================================= */

.header-actions {

  display: flex;

  align-items: center;

  gap: 18px;

}


.student-badge {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 6px 10px 6px 7px;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 12px;
  background: rgba(248, 250, 252, 0.72);
  transition: all 0.2s ease;
}

.student-badge:hover {
  background: #f8fbff;
  border-color: #dbeafe;
}


.student-info {

  display: flex;

  flex-direction: column;

  gap: 2px;

}


.student-info span {

  color: #94a3b8;

  font-size: 9px;

}


.student-info strong {

  color: #334155;

  font-size: 11px;

}


.student-arrow {

  color: #64748b;

  font-size: 15px;

}


.logout-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 12px;
  border: 1px solid transparent;
  border-radius: 10px;
  background: transparent;
  color: #64748b;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: #fef2f2;
  border-color: #fee2e2;
  color: #dc2626;
}

.logout-icon {
  font-size: 16px;
  line-height: 1;
}

/* =========================================================
   HERO
========================================================= */

.hero {
  width: 100%;
  min-height: calc(100vh - 78px);
  box-sizing: border-box;

padding: 35px 5% 42px;

  display: grid;

  /* TEXT LEFT — AHMAD RIGHT */
  grid-template-columns: 1.08fr 0.92fr;

  align-items: center;
  gap: 20px;

  direction: ltr;
  background: url('/backgrounds/library-bg.png') center center / cover no-repeat;
}


/* =========================================================
   LEFT CONTENT
========================================================= */

.hero-content {
  max-width: 700px;
  position: relative;
  z-index: 20;
  text-align: left;
  direction: ltr;
}


.eyebrow {

  display: inline-flex;

  align-items: center;

  padding:
    9px 17px;

  border-radius: 22px;

  background:
    rgba(226,237,253,0.96);

  color: #3566a8;

  font-size: 10px;

  font-weight: 700;

  letter-spacing: 2px;

  margin-bottom: 22px;

}


/* =========================================================
   TITLE
========================================================= */

.hero-content h1 {
  margin: 0;

  max-width: 760px;

  color: #102a43;

font-size: clamp(
  68px,
  6vw,
  100px
);

  line-height: 1.01;

  letter-spacing: -3.5px;

  font-weight: 800;
}


.hero-content h1 span {
  display: block;
  color: #2563eb;
  white-space: nowrap;
}

/* =========================================================
   DESCRIPTION
========================================================= */

.hero-description {
  max-width: 560px;
  margin: 22px 0 0;
  color: #52677d;
  font-size: 16px;
  line-height: 1.75;
  font-weight: 400;
}


/* =========================================================
   FEATURES
========================================================= */

.features {
  display: flex;
  align-items: stretch;
  gap: 12px;
  margin-top: 30px;
  max-width: 650px;
}


.feature {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 13px;
  background: rgba(255, 255, 255, 0.58);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  backdrop-filter: blur(8px);
  transition: all 0.2s ease;
}
.feature:hover {
  background: rgba(255, 255, 255, 0.82);
  border-color: #dbeafe;
  transform: translateY(-2px);
}


.feature-icon {

  width: 42px;
  height: 42px;

  border-radius: 12px;

  display: flex;

  align-items: center;
  justify-content: center;

background: rgba(160,185,215,1);

  font-size: 17px;

}


.feature-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  min-width: 0;
}


.feature-text strong {
  color: #000000;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.2;
}

.feature-text span {
  color: #94a3b8;
  font-size: 9px;
  line-height: 1.3;
}


/* =========================================================
   BUTTONS
========================================================= */

.hero-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 32px;
}


.primary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 15px 28px;
  border: none;
  border-radius: 11px;
  background: #2563eb;
  color: white;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 28px rgba(37, 99, 235, 0.32);
  transition: all 0.2s ease;
}

.primary-btn:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 13px 32px rgba(37, 99, 235, 0.38);
}
.primary-btn:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 11px 24px rgba(37, 99, 235, 0.25);
}


.secondary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  border: 1px solid #dbe4ef;
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.62);
  color: #334155;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.secondary-btn:hover {
  background: white;
  border-color: #bfdbfe;
  color: #2563eb;
  transform: translateY(-2px);
}

/* =========================================================
   NOTE
========================================================= */

.hero-note {

  display: flex;

  align-items: flex-start;

  gap: 8px;

  margin-top: 20px;

  margin-left: 80px;

  color: #9bb1d1;

}


.note-arrow {

  font-size: 30px;

  line-height: 1;

}


.hero-note em {

  font-size: 12px;

  line-height: 1.3;

}


/* =========================================================
   AHMAD SECTION
========================================================= */

.avatar-section {

  width: 100%;

  height: 100%;

  min-width: 0;

  display: flex;

  align-items: center;

  justify-content: flex-end;

}


/* =========================================================
   AHMAD STAGE
   No separate white card / no empty frame
========================================================= */

.avatar-stage {
  position: relative;
  width: 100%;
  height: min(690px, calc(100vh - 115px));
  min-height: 590px;
overflow: visible;
  border-radius: 0;
background: transparent;
}

/* =========================================================
   LIGHT BEHIND AHMAD
========================================================= */

.stage-glow {
  display: none;

  position: absolute;

  width: 690px;
  height: 690px;

  left: 53%;
  top: 50%;

  transform:
    translate(-50%, -50%);

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(255,255,255,0.98) 0%,
      rgba(255,255,255,0.72) 38%,
      transparent 73%
    );

  filter: blur(8px);

  z-index: 1;

}


/* =========================================================
   AHMAD
   Large and intentionally cropped
========================================================= */

.avatar-wrapper {
  position: absolute;
left: 48%;
bottom: -160px;
  transform: translateX(-50%);
width: 105%;

height: 120%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 5;
}


.ahmad-avatar {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center bottom;
  filter:
    drop-shadow(0 24px 30px rgba(15, 23, 42, 0.14))
    drop-shadow(0 4px 10px rgba(37, 99, 235, 0.06));
}


/* =========================================================
   ONLINE CARD
   Close to Ahmad's head
========================================================= */

.online-card {
  position: absolute;
left: 20%;
  top: 15%;
  display: flex;
  align-items: center;
  gap: 10px;
padding: 8px 11px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 10px 28px rgba(15, 42, 67, 0.10);
  backdrop-filter: blur(12px);
  z-index: 10;
  animation: floatCard 4s ease-in-out infinite;
}


.online-dot {

  width: 11px;
  height: 11px;

  flex-shrink: 0;

  border-radius: 50%;

  background: #22c55e;

  box-shadow:
    0 0 0 4px
    rgba(34,197,94,0.12);

}


.online-card div {

  display: flex;

  flex-direction: column;

  gap: 3px;

}


.online-card strong {
  color: #2563eb;
  font-size: 14px;
  font-weight: 800;
}


.online-card span:not(.online-dot) {
  color: #64748b;
  font-size: 9px;
}


/* =========================================================
   SPEECH CARD
   Close to Ahmad's left side
========================================================= */

.speech-card {
  position: absolute;
left: 16%;
  top: 43%;
padding: 11px 14px;
  background: rgba(255, 255, 255, 0.84);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 14px;
  box-shadow: 0 12px 30px rgba(15, 42, 67, 0.10);
  backdrop-filter: blur(12px);
  z-index: 10;
  animation: floatCard 5s ease-in-out infinite;
}


.speech-card strong {

  display: block;

  color: #102a43;

font-size: 15px;

  margin-bottom: 5px;

}


.speech-card span {

  color: #2563eb;

font-size: 13px;

  line-height: 1.4;

  font-weight: 700;

}


/* =========================================================
   FEATURE RAIL
   Close to Ahmad's right side
========================================================= */

.feature-rail {
  position: absolute;
right: 21%;
  top: 24%;
  display: flex;
  flex-direction: column;
  gap: 8px;
padding: 6px;
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid rgba(255, 255, 255, 0.82);
  border-radius: 14px;
  box-shadow: 0 10px 26px rgba(15, 42, 67, 0.08);
  backdrop-filter: blur(12px);
  z-index: 10;
}


.rail-item {
  display: flex;
  align-items: center;
  gap: 10px;
padding: 7px 9px;
min-width: 72px;
  border-radius: 10px;
  color: #334155;
  font-size: 12px;
  font-weight: 650;
}


.rail-icon {
font-size: 15px;
  line-height: 1;
}


.rail-item strong {

  color: #334e68;

  font-size: 9px;

}


/* =========================================================
   JOURNEY
   Close to Ahmad's lower body
========================================================= */

.journey-card {
  position: absolute;
  right: 18%;
  bottom: 8%;
  display: flex;
  align-items: center;
gap: 9px;
padding: 9px 12px;
  background: rgba(255, 255, 255, 0.80);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 13px;
  box-shadow: 0 10px 28px rgba(15, 42, 67, 0.09);
  backdrop-filter: blur(12px);
  z-index: 10;
  animation: floatCard 4.5s ease-in-out infinite;
}


.check-icon {

  width: 44px;
  height: 44px;

  flex-shrink: 0;

  border-radius: 50%;

  display: flex;

  align-items: center;
  justify-content: center;

  background: #22c55e;

  color: white;

  font-size: 26px;

  font-weight: 700;

}


.journey-text {

  display: flex;

  flex-direction: column;

}


.journey-text strong {

  color: #102a43;

  font-size: 12px;

  line-height: 1.35;

}


.journey-text span {

  color: #94a3b8;

  font-size: 9px;

  margin-top: 4px;

}


/* =========================================================
   RESPONSIVE SYSTEM
   Desktop → Laptop → Tablet → Mobile
   ========================================================= */

/* =========================================================
   LAPTOP
   Keep the original desktop composition:
   text left + Ahmad right.
   ========================================================= */
@media (max-width: 1250px) {

  .main-nav {
    height: 100%;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .hero {
    width: 100%;
    min-height: calc(100vh - 78px);
    padding: 35px 5% 42px;
    display: grid;
    grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
    align-items: center;
    gap: 20px;
    direction: ltr;
    background: url('/backgrounds/library-bg.png') center center / cover no-repeat !important;
  }

  .hero-content h1 {
    font-size: clamp(44px, 4.5vw, 62px);
  }

  .hero-description {
    font-size: 14px;
  }

  .avatar-stage {
    min-height: 530px;
  }

  .avatar-wrapper {
    width: 82%;
  }

  .online-card {
    left: 20%;
  }

  .speech-card {
    left: 13%;
  }

  .feature-rail {
    right: 12%;
  }

  .journey-card {
    right: 13%;
  }
}


/* =========================================================
   TABLET
   One column, with Ahmad FIRST.
   ========================================================= */
@media (max-width: 900px) {

  .welcome-page {
    overflow-x: hidden;
    overflow-y: auto;
  }

  .welcome-header {
    padding: 0 22px;
  }

  .hero {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    min-height: auto;
    padding: 38px 22px 60px;
    gap: 34px;
  }

  /*
    Ahmad is the first visual section on tablet.
    The speaking content follows underneath.
  */
  .avatar-section {
    grid-column: 1;
    grid-row: 1;
    order: 1;

    width: 100%;
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hero-content {
    grid-column: 1;
    grid-row: 2;
    order: 2;

    width: 100%;
    max-width: 700px;
    margin: 0 auto;
  }

  .hero-content h1 span {
    white-space: normal;
  }

  .hero-description {
    margin-left: 0;
    margin-right: 0;
  }

  .features {
    justify-content: center;
    width: 100%;
  }

  .hero-actions {
    justify-content: flex-start;
  }

  .hero-note {
    justify-content: flex-start;
    margin-left: 40px;
  }

  .avatar-stage {
    width: min(100%, 720px);
    height: 590px;
    min-height: 590px;
    margin: 0 auto;
  }

  .avatar-wrapper {
    left: 50%;
    bottom: -70px;
    width: 88%;
    height: 112%;
  }

  .online-card {
    left: 8%;
    top: 10%;
  }

  .speech-card {
    left: 5%;
    top: 42%;
  }

  .feature-rail {
    right: 8%;
    top: 22%;
  }

  .journey-card {
    right: 7%;
    bottom: 5%;
  }
}


/* =========================================================
   MOBILE
   Ahmad FIRST → Speaking content SECOND
   ========================================================= */
@media (max-width: 600px) {

  .welcome-header {
    height: 68px;
    padding: 0 16px;
    direction: ltr;
  }

  .welcome-header .brand {
    order: 1;
  }

  .welcome-header .header-actions {
    order: 2;
  }

  .brand-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #ffffff;
    font-size: 24px;
    font-weight: 800;
    letter-spacing: -0.9px;
  }

  .brand-mark {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: linear-gradient(135deg, #3b82f6, #60a5fa);
    color: white;
    font-size: 8px;
    box-shadow: 0 5px 16px rgba(37, 99, 235, 0.22);
  }

  .brand-tagline {
    padding-left: 40px;
    color: #cbd5e1;
    font-size: 8px;
    font-weight: 500;
    letter-spacing: 0.35px;
  }

  .main-nav {
    display: none;
  }

  .student-badge {
    display: none;
  }

  .hero {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    min-height: auto;
    padding: 22px 16px 45px;
    gap: 22px;
  }

  /*
    Ahmad is intentionally the FIRST section on the phone.
    This is a real layout reorder, not just a visual transform.
  */
  .avatar-section {
    grid-column: 1;
    grid-row: 1;
    order: 1;

    width: 100%;
    height: auto;
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .avatar-stage {
    width: 100%;
    height: 520px;
    min-height: 520px;
    margin: 0 auto;
    overflow: visible;
  }

  .avatar-wrapper {
    left: 50%;
    bottom: -20px;
    width: 94%;
    height: 100%;
  }

  .online-card {
    left: 2%;
    top: 8%;
    padding: 10px 12px;
    z-index: 10;
  }

  .online-card strong {
    font-size: 12px;
  }

  .online-card span:not(.online-dot) {
    font-size: 8px;
  }

  .speech-card {
    left: 2%;
    top: 43%;
    padding: 10px 12px;
    z-index: 10;
  }

  .speech-card strong {
    font-size: 13px;
  }

  .speech-card span {
    font-size: 11px;
  }

  .feature-rail {
    right: 2%;
    top: 22%;
    width: 64px;
    padding: 5px;
    gap: 6px;
    z-index: 10;
  }

  .rail-item {
    gap: 7px;
    padding: 7px;
    min-width: 0;
  }

  .rail-icon {
    font-size: 14px;
  }

  .rail-item strong {
    font-size: 8px;
  }

  .journey-card {
    right: 2%;
    bottom: 3%;
    max-width: 132px;
    box-sizing: border-box;
    padding: 10px 11px;
    gap: 8px;
    z-index: 10;
  }

  .check-icon {
    width: 34px;
    height: 34px;
    font-size: 20px;
  }

  .journey-text strong {
    font-size: 9px;
  }

  .journey-text span {
    font-size: 7px;
  }

  /*
    Speaking content is the SECOND section.
  */
  .hero-content {
    grid-column: 1;
    grid-row: 2;
    order: 2;

    width: 100%;
    max-width: none;
    margin: 0;
  }

  .eyebrow {
    max-width: 100%;
    box-sizing: border-box;
    font-size: 8px;
    letter-spacing: 1.5px;
    padding: 8px 12px;
  }

  .hero-content h1 {
    font-size: 40px;
    line-height: 1.08;
    letter-spacing: -1.8px;
  }

  .hero-content h1 span {
    white-space: normal;
  }

  .hero-description {
    max-width: 100%;
    font-size: 13px;
    line-height: 1.7;
  }

  /*
    Keep the same responsive behavior used by Sessions:
    horizontal on wider screens, stacked on phones.
  */
  .features {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    max-width: 100%;
    margin-left: 0;
    margin-right: 0;
    gap: 14px;
  }

  .feature {
    width: 100%;
    flex: none;
    box-sizing: border-box;
  }

  .hero-actions {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    gap: 12px;
    margin-top: 26px;
  }

  .primary-btn,
  .secondary-btn {
    width: 100%;
    box-sizing: border-box;
  }

  .hero-note {
    justify-content: center;
    margin-left: 0;
  }
}


/* =========================================================
   SMALL MOBILE
   ========================================================= */
@media (max-width: 380px) {

  .welcome-header {
    padding: 0 12px;
  }

  .brand-logo {
    font-size: 21px;
    gap: 8px;
  }

  .brand-mark {
    width: 27px;
    height: 27px;
  }

  .logout-btn {
    padding: 6px 9px;
    font-size: 9px;
  }

  .hero {
    padding-left: 12px;
    padding-right: 12px;
    gap: 18px;
  }

  .avatar-stage {
    height: 480px;
    min-height: 480px;
  }

  .hero-content h1 {
    font-size: 34px;
    letter-spacing: -1.5px;
  }

  .feature-rail {
    right: 1%;
    width: 60px;
  }

  .journey-card {
    right: 1%;
    max-width: 124px;
  }
}


/* =========================================================
   HEADER VISIBILITY
   ========================================================= */
.welcome-header .brand-logo > span:last-child {
  color: #ffffff !important;
  font-size: 24px !important;
  font-weight: 800 !important;
  opacity: 1 !important;
  visibility: visible !important;
}

.welcome-header .brand-tagline {
  color: #cbd5e1 !important;
  opacity: 1 !important;
  visibility: visible !important;
}

.welcome-header .brand-mark {
  background: linear-gradient(135deg, #3b82f6, #60a5fa) !important;
}

</style>
