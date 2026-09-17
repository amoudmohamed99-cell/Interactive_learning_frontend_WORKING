<template>
  <div class="scenarios-page">

    <!-- =========================
         TOP BAR
    ========================== -->
<header class="top-bar">

  <!-- LEFT: STUDENT + LOG OUT -->
  <div class="student-area">

    <div class="student-badge">
      <div class="student-icon">
        👋
      </div>

      <div class="student-info">
        <span class="student-label">Student</span>
        <strong>{{ studentName }}</strong>
      </div>
    </div>

    <button
      class="logout-btn"
      @click="handleLogout"
    >
      خروج
    </button>

  </div>


  <!-- RIGHT: BRAND -->
  <div class="brand">
    <div class="brand-name">SpeakBetter</div>
    <div class="brand-tagline">
      Real Conversations. A Brighter You.
    </div>
  </div>

</header>


    <!-- =========================
         MAIN CONTENT
    ========================== -->
    <main class="content">

      <!-- =========================
           WELCOME
      ========================== -->
      <section class="welcome-section">

        <div class="welcome-copy">

          <span class="welcome-label">
            SPEAKBETTER PRACTICE
          </span>

          <h1>
            Welcome back!
            <span>👋</span>
          </h1>

          <p>
            Choose a speaking session and practice
            real-life conversations with Ahmad.
          </p>

        </div>


        <!-- =========================
             PROGRESS
        ========================== -->
        <div class="progress-card">

          <div class="progress-top">

            <div>
              <span class="progress-label">
                Your Progress
              </span>

              <strong>
                1 <span>/ 10</span>
              </strong>
            </div>

            <div class="progress-percent">
              10%
            </div>

          </div>

          <div class="progress-track">
            <div class="progress-fill"></div>
          </div>

          <p>
            Keep going — you're making progress!
          </p>

        </div>

      </section>

<div class="journey-message">
  Your speaking journey starts with one conversation.
</div>

      <!-- =========================
           SECTION HEADER
      ========================== -->
      <section class="sessions-header">

        <div>
          <span class="section-eyebrow">
            YOUR LEARNING JOURNEY
          </span>

          <h2>
            Speaking Sessions
          </h2>

          <p>
            Choose a scenario and start practicing with Ahmad.
          </p>
        </div>

      </section>


      <!-- =========================
           LOADING
      ========================== -->
      <div
        v-if="loadingScenarios"
        class="loading-state"
      >
        <div class="loading-spinner"></div>

        <p>
          جاري تحميل الجلسات...
        </p>
      </div>


      <!-- =========================
           SESSIONS GRID
      ========================== -->
      <section
        v-else
        class="scenarios-grid"
      >

        <article
          v-for="scenario in scenarios"
          :key="scenario.id"
          class="scenario-card"
          :class="{
            current: scenario.number === 1,
            disabled: creatingSession
          }"
        >

          <!-- Card top -->
          <div class="card-top">

            <div class="session-badge">
              Session {{ String(scenario.number).padStart(2, '0') }}
            </div>

            <div class="scenario-number">
              {{ String(scenario.number).padStart(2, '0') }}
            </div>

          </div>


          <!-- Icon -->
          <div class="scenario-icon">
            <span>
              {{ getScenarioIcon(scenario.number) }}
            </span>
          </div>


          <!-- Content -->
          <div class="scenario-info">

            <span class="session-label">
              SPEAKING SESSION
            </span>

            <h3>
              {{ scenario.title }}
            </h3>

            <p class="title-ar">
              {{ scenario.title_ar }}
            </p>

            <p class="scenario-description">
              {{ getScenarioDescription(scenario.number) }}
            </p>

          </div>


          <!-- Meta -->
          <div class="scenario-meta">

            <span>
              {{ scenario.topic }}
            </span>

            <span class="meta-dot">
              •
            </span>

            <span>
              {{ scenario.communicative_function }}
            </span>

          </div>


          <!-- Footer -->
          <div class="card-footer">

            <span
              v-if="scenario.number === 1"
              class="status current-status"
            >
              ● Current Session
            </span>

            <span
              v-else
              class="status"
            >
              Not Started
            </span>


            <button
              class="start-btn"
              :disabled="creatingSession"
              @click.stop="startScenario(scenario)"
            >

              <span
                v-if="creatingFor === scenario.id"
                class="spinner-sm"
              ></span>

              <span v-else>
                Start Session
                <span class="arrow">→</span>
              </span>

            </button>

          </div>

        </article>

      </section>


      <!-- =========================
           BOTTOM MOTIVATION
      ========================== -->
      <section class="motivation-card">

        <div class="motivation-icon">
          ✦
        </div>

        <div>
          <strong>
            Small steps every day.
          </strong>

          <span>
            Keep practicing and build your confidence.
          </span>
        </div>

      </section>

    </main>

  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  getScenarios,
  createSession,
  logout
} from '../api'

const router = useRouter()

const scenarios = ref([])
const loadingScenarios = ref(true)

const creatingSession = ref(false)
const creatingFor = ref(null)

const student = JSON.parse(
  localStorage.getItem('student') || '{}'
)

const studentName =
  student.code || 'طالب'


/* =========================
   LOAD SCENARIOS
========================= */

onMounted(async () => {
  try {

    const data = await getScenarios()

    scenarios.value =
      data.data || data || []

  } catch (error) {

    console.error(
      'Failed to load scenarios:',
      error
    )

  } finally {

    loadingScenarios.value = false

  }
})


/* =========================
   START SESSION
========================= */

const startScenario = async (scenario) => {

  if (creatingSession.value) {
    return
  }

  creatingSession.value = true
  creatingFor.value = scenario.id

  try {
    const sessionNum = scenario.number || 1
    const data = await createSession(
      scenario.id,
      sessionNum
    )

    const sessionId =
      data.data?.id ||
      data.id ||
      data.session?.id

    if (!sessionId) {
      throw new Error(
        'Session ID was not returned.'
      )
    }

    router.push(
      `/check/${sessionId}`
    )

  } catch (error) {

    console.error(
      'Failed to create session:',
      error
    )

    alert(
      error.response?.data?.message ||
      'حصل خطأ، جرب تاني'
    )
  } finally {

    creatingSession.value = false
    creatingFor.value = null

  }
}


/* =========================
   LOGOUT
========================= */

const handleLogout = async () => {

  await logout()

  router.push('/')

}


/* =========================
   SESSION ICONS
========================= */

const getScenarioIcon = (number) => {

  const icons = {
    1: '👤',
    2: '📅',
    3: '⚽',
    4: '💬',
    5: '📍',
    6: '❤️',
    7: '💡',
    8: '🗣️',
    9: '📊',
    10: '🏆'
  }

  return icons[number] || '💬'

}


/* =========================
   SESSION DESCRIPTIONS
========================= */

const getScenarioDescription = (number) => {

  const descriptions = {

    1:
      'Talk about yourself and answer basic questions.',

    2:
      'Talk about your daily routine and recent changes.',

    3:
      'Talk about your hobbies, interests and qualities.',

    4:
      'Practice asking questions and giving useful information.',

    5:
      'Describe people, places and your surroundings.',

    6:
      'Share your opinions and talk about your preferences.',

    7:
      'Give advice, make suggestions and practice negotiation.',

    8:
      'Talk about experiences and describe events clearly.',

    9:
      'Combine your speaking skills in longer conversations.',

    10:
      'Practice what you have learned and build confidence.'

  }

  return (
    descriptions[number] ||
    'Practice English through a realistic conversation.'
  )

}
</script>


<style scoped>

/* =========================================
   PAGE
========================================= */

.scenarios-page {
    direction: ltr;
  min-height: 100vh;
  direction: ltr;
  background:
    linear-gradient(
      180deg,
      #f8fbff 0%,
      #f1f6fc 100%
    );

  color: #102a43;
}


/* =========================================
   TOP BAR
========================================= */

.top-bar {
  height: 78px;

  padding: 0 5%;

  background: #102a43;

  border-bottom:
    1px solid rgba(148, 163, 184, 0.12);

  display: flex;

  align-items: center;

  justify-content: space-between;

  position: sticky;

  top: 0;

  z-index: 50;

  backdrop-filter: blur(15px);

  box-sizing: border-box;
}


.brand {
  display: flex;

  flex-direction: column;

  gap: 2px;
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


.student-area {
  display: flex;

  align-items: center;

  gap: 18px;
}


.student-badge {
  display: flex;

  align-items: center;

  gap: 9px;
}


.student-icon {
  width: 36px;
  height: 36px;
  border-radius: 11px;

  background: rgba(255, 255, 255, 0.10);

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
}



.student-info strong {
  color: #ffffff;
  font-size: 12px;
}

.logout-btn {
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  border-radius: 9px;
  padding: 8px 17px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}


.logout-btn:hover {
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(255, 255, 255, 0.35);
}


/* =========================================
   CONTENT
========================================= */

.content {
  width: min(
    1500px,
    calc(100% - 64px)
  );

  margin: 0 auto;

  padding:
    44px 0 50px;
}


/* =========================================
   WELCOME
========================================= */

.welcome-section {
  display: grid;

  grid-template-columns:
    1fr
    320px;

  gap: 40px;

  align-items: center;

  margin-bottom: 46px;

  text-align: left;
}


.welcome-copy {
  max-width: 700px;
  justify-self: start;

margin-left: calc(
  (min(1500px, 100vw - 64px) - 100vw) / 2 + 30px
);
}


.welcome-label {
  display: inline-block;

  margin-bottom: 9px;

  color: #2563eb;

  font-size: 10px;

  font-weight: 800;

  letter-spacing: 1.5px;
}


.welcome-copy h1 {
  margin: 0 0 10px;

  color: #102a43;

  font-size: 40px;

  line-height: 1.15;

  font-weight: 800;

  letter-spacing: -1.2px;
}


.welcome-copy h1 span {
  font-size: 34px;
}


.welcome-copy p {
  margin: 0;

  max-width: 600px;

  color: #647b91;

  font-size: 15px;

  line-height: 1.7;
}


/* =========================================
   PROGRESS CARD
========================================= */

.progress-card {
  background: white;

  border:
    1px solid #e5edf6;

  border-radius: 18px;

  padding: 20px;

  box-shadow:
    0 8px 28px
    rgba(
      36,
      75,
      120,
      0.07
    );

  width: 100%;
  max-width: 320px;
  box-sizing: border-box;
  justify-self: end;
}


.progress-top {
  display: flex;

  align-items: flex-end;

  justify-content: space-between;

  margin-bottom: 13px;
}


.progress-label {
  display: block;

  color: #8da0b2;

  font-size: 10px;

  margin-bottom: 4px;
}


.progress-card strong {
  color: #102a43;

  font-size: 25px;

  line-height: 1;
}


.progress-card strong span {
  color: #91a2b3;

  font-size: 15px;
}


.progress-percent {
  color: #2563eb;

  font-size: 13px;

  font-weight: 800;
}


.progress-track {
  height: 7px;

  width: 100%;

  background: #e9f0f8;

  border-radius: 99px;

  overflow: hidden;
}


.progress-fill {
  width: 10%;

  height: 100%;

  background:
    linear-gradient(
      90deg,
      #2563eb,
      #4f8cff
    );

  border-radius: inherit;
}


.progress-card p {
  margin:
    10px 0 0;

  color: #8295a8;

  font-size: 10px;
}


/* =========================================
   SECTION HEADER
========================================= */

.sessions-header {
  display: flex;

  justify-content: space-between;

  align-items: flex-end;

  margin-bottom: 20px;
}


.section-eyebrow {
  color: #2563eb;

  font-size: 9px;

  font-weight: 800;

  letter-spacing: 1.2px;
}


.sessions-header h2 {
  margin:
    5px 0 5px;

  color: #102a43;

  font-size: 26px;

  font-weight: 800;

  letter-spacing: -0.5px;
}




.sessions-header p {
  margin: 0;

  color: #74889c;

  font-size: 13px;
}


/* =========================================
   GRID
========================================= */

.scenarios-grid {
  display: grid;

  grid-template-columns:
    repeat(4, minmax(0, 1fr));

gap: 40px;

}


/* =========================================
   CARD
========================================= */

.scenario-card {
  min-width: 0;

  background:
    rgba(
      255,
      255,
      255,
      0.98
    );

  border:
    1px solid #e5edf6;

  border-radius: 18px;

  padding: 20px;

  display: flex;

  flex-direction: column;

  min-height: 360px;

  box-shadow:
    0 7px 24px
    rgba(
      36,
      75,
      120,
      0.055
    );

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}


.scenario-card:hover {
  transform:
    translateY(-5px);

  border-color:
    #bfd5ff;

  box-shadow:
    0 15px 34px
    rgba(
      37,
      99,
      235,
      0.10
    );
}


/* =========================================
   CURRENT CARD
========================================= */

.scenario-card.current {
  border: 2px solid #3b82f6;

  background:
    linear-gradient(
      145deg,
      rgba(239, 246, 255, 0.98),
      rgba(255, 255, 255, 0.98)
    );

  box-shadow:
    0 14px 36px
    rgba(37, 99, 235, 0.14);
}

.scenario-card.current::before {
  content: '';

  position: absolute;
}


/* =========================================
   CARD TOP
========================================= */

.card-top {
  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-bottom: 18px;
}


.session-badge {
  color: #71869a;

  font-size: 9px;

  font-weight: 700;

  letter-spacing: 0.5px;
}


.scenario-number {
  width: 43px;

  height: 43px;

  border-radius: 13px;

  background:
    linear-gradient(
      135deg,
      #2563eb,
      #1d4ed8
    );

  color: white;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 14px;

  font-weight: 800;

  box-shadow:
    0 5px 12px
    rgba(
      37,
      99,
      235,
      0.18
    );
}


/* =========================================
   ICON
========================================= */

.scenario-icon {
  width: 54px;

  height: 54px;

  border-radius: 16px;

  background:
    #edf5ff;

  display: flex;

  align-items: center;

  justify-content: center;

  margin-bottom: 17px;
}


.scenario-icon span {
  font-size: 25px;
}


/* =========================================
   INFO
========================================= */

.scenario-info {
  flex: 1;

  min-width: 0;
}


.session-label {
  display: block;

  margin-bottom: 6px;

  color: #93a4b5;

  font-size: 8px;

  font-weight: 800;

  letter-spacing: 0.7px;
}


.scenario-info h3 {
  margin: 0 0 6px;

  color: #17324d;

  font-size: 17px;

  line-height: 1.3;

  font-weight: 800;
}


.title-ar {
  margin: 0 0 10px;

  color: #6f8396;

  font-size: 11px;

  line-height: 1.5;
}


.scenario-description {
  margin: 0;

  color: #8093a5;

  font-size: 11px;

  line-height: 1.55;
}


/* =========================================
   META
========================================= */

.scenario-meta {
  min-height: 32px;

  display: flex;

  align-items: center;

  flex-wrap: wrap;

  gap: 5px;

  margin:
    17px 0 15px;

  color: #4b83ed;

  font-size: 9px;

  line-height: 1.4;
}


.meta-dot {
  color: #c5d2df;
}


/* =========================================
   CARD FOOTER
========================================= */

.card-footer {
  border-top:
    1px solid #edf2f7;

  padding-top: 15px;

  display: flex;

  flex-direction: column;

  gap: 11px;
}


.status {
  color: #9aaaba;

  font-size: 9px;

  font-weight: 700;
}


.current-status {
  color: #2563eb;
}


/* =========================================
   START BUTTON
========================================= */

.start-btn {
  width: 100%;
  min-height: 44px;

  border: none;
  border-radius: 10px;

  background: #2563eb;
  color: white;

  font-size: 12px;
  font-weight: 800;

  cursor: pointer;

  box-shadow: 0 7px 18px rgba(37, 99, 235, 0.20);

  transition:
    background 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.start-btn:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(37, 99, 235, 0.28);
}


.start-btn:hover:not(:disabled) {
  background:
    #1d4ed8;

  transform:
    translateY(-1px);
}


.start-btn:disabled {
  cursor: not-allowed;

  opacity: 0.7;
}


.arrow {
  margin-left: 4px;

  font-size: 13px;
}


/* =========================================
   LOADING
========================================= */

.loading-state {
  min-height: 300px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 14px;

  color: #71869a;
}


.loading-spinner,
.spinner-sm {
  border:
    3px solid #dce8f8;

  border-top-color:
    #2563eb;

  border-radius: 50%;

  animation:
    spin 0.8s linear infinite;
}


.loading-spinner {
  width: 35px;

  height: 35px;
}


.spinner-sm {
  display: inline-block;

  width: 14px;

  height: 14px;

  border-width: 2px;

  vertical-align: middle;
}


.loading-state p {
  margin: 0;

  font-size: 12px;
}


/* =========================================
   MOTIVATION
========================================= */

.motivation-card {
  margin-top: 30px;

  padding: 18px 22px;

  background:
    linear-gradient(
      100deg,
      #edf5ff,
      #f7fbff
    );

  border:
    1px solid #dfeafb;

  border-radius: 17px;

  display: flex;

  align-items: center;

  gap: 13px;
}


.motivation-icon {
  width: 38px;

  height: 38px;

  flex-shrink: 0;

  border-radius: 12px;

  background: #dceaff;

  color: #2563eb;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 17px;
}


.motivation-card strong {
  display: block;

  color: #23405e;

  font-size: 12px;

  margin-bottom: 2px;
}


.motivation-card span {
  color: #8295a8;

  font-size: 10px;
}


/* =========================================
   ANIMATION
========================================= */

@keyframes spin {

  to {
    transform: rotate(360deg);
  }

}


/* =========================================
   LARGE LAPTOP
========================================= */

@media (max-width: 1200px) {

  .scenarios-grid {
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
  }

}


/* =========================================
   TABLET
========================================= */

@media (max-width: 900px) {

  .top-bar {
    padding:
      0 24px;
  }


  .content {
    width:
      min(
        100% - 40px,
        720px
      );
  }


  .welcome-section {
    grid-template-columns: 1fr;

    gap: 22px;
  }


  .progress-card {
    max-width: 420px;
  }


  .scenarios-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

}


/* =========================================
   MOBILE
========================================= */

@media (max-width: 600px) {

  .top-bar {
    height: auto;

    padding:
      13px 16px;

    gap: 12px;
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


  .student-icon {
    width: 31px;

    height: 31px;
  }


  .student-info {
    display: none;
  }


  .logout-btn {
    padding:
      7px 11px;

    font-size: 10px;
  }


  .content {
    width:
      calc(100% - 28px);

    padding:
      28px 0 35px;
  }


  .welcome-section {
    margin-bottom: 34px;
  }


  .welcome-copy h1 {
    font-size: 30px;

    letter-spacing: -0.7px;
  }


  .welcome-copy h1 span {
    font-size: 27px;
  }


  .welcome-copy p {
    font-size: 13px;
  }


  .sessions-header h2 {
    font-size: 23px;
  }


  .sessions-header p {
    font-size: 11px;
  }


  .scenarios-grid {
    grid-template-columns: 1fr;

    gap: 14px;
  }


  .scenario-card {
    min-height: 330px;

    padding: 18px;
  }


  .motivation-card {
    padding:
      15px;

    align-items: flex-start;
  }

}


/* =========================================
   VERY SMALL MOBILE
========================================= */

@media (max-width: 380px) {

  .brand-name {
    font-size: 15px;
  }


  .welcome-copy h1 {
    font-size: 27px;
  }


  .scenario-info h3 {
    font-size: 16px;
  }

}
.journey-message {
  width: 100%;
  text-align: center;

  color: #8ba0b5;

font-size: 16px;
  font-weight: 500;

  margin-top: -20px;
  margin-bottom: 28px;
}
</style>