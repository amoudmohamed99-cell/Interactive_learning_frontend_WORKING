<template>
  <div class="scenarios-page">
    <header class="top-bar">
  <div class="brand">
    <div class="brand-name">SpeakBetter</div>
    <div class="brand-tagline">Real Conversations. A Brighter You.</div>
  </div>

  <div class="student-area">
    <div class="student-badge">
      <span class="student-icon">👋</span>
      <div>
        <span class="student-label">Student</span>
        <strong>{{ studentName }}</strong>
      </div>
    </div>

    <button class="logout-btn" @click="handleLogout">
      خروج
    </button>
  </div>
</header>

  <div class="content">
<div class="welcome-section">
  <div>
    <span class="welcome-label">SPEAKBETTER PRACTICE</span>
    <h2>Welcome back! 👋</h2>
    <p class="desc">
      Choose a speaking scenario and start practicing with Ahmad.
    </p>
  </div>

    <div class="progress-mini">
      <span class="progress-label">Your Progress</span>
      <strong>1 / 10</strong>
      <div class="progress-track">
        <div class="progress-fill"></div>
      </div>
    </div>
  </div>

  <div v-if="loadingScenarios" class="loading">جاري التحميل...</div>

      <div v-else class="scenarios-grid">
       <div
  v-for="scenario in scenarios"
  :key="scenario.id"
  class="scenario-card"
  :class="{ disabled: creatingSession }"
  @click="startScenario(scenario)"
>
  <div class="scenario-number">
    {{ String(scenario.number).padStart(2, '0') }}
  </div>

  <div class="scenario-info">
    <span class="session-label">SPEAKING SESSION</span>

    <h3>{{ scenario.title }}</h3>

    <p class="title-ar">{{ scenario.title_ar }}</p>

    <div class="scenario-meta">
      <span>{{ scenario.topic }}</span>
      <span class="meta-dot">•</span>
      <span>{{ scenario.communicative_function }}</span>
    </div>
  </div>

  <button class="start-btn" :disabled="creatingSession">
    <span v-if="creatingFor === scenario.id" class="spinner-sm"></span>
    <span v-else>Start →</span>
  </button>
</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getScenarios, createSession, logout } from '../api'

const router = useRouter()
const scenarios = ref([])
const loadingScenarios = ref(true)
const creatingSession = ref(false)
const creatingFor = ref(null)

const student = JSON.parse(localStorage.getItem('student') || '{}')
const studentName = student.code || 'طالب'

onMounted(async () => {
  try {
    const data = await getScenarios()
    scenarios.value = data.data || data
  } catch (e) {
    console.error(e)
  } finally {
    loadingScenarios.value = false
  }
})

const startScenario = async (scenario) => {
  if (creatingSession.value) return
  creatingSession.value = true
  creatingFor.value = scenario.id
  try {
    const data = await createSession(scenario.id, 1)
    const sessionId = data.data?.id || data.id || data.session?.id
    router.push(`/check/${sessionId}`)
  } catch (e) {
    alert(e.response?.data?.message || 'حصل خطأ، جرب تاني')
  } finally {
    creatingSession.value = false
    creatingFor.value = null
  }
}

const handleLogout = async () => {
  await logout()
  router.push('/')
}
</script>

<style scoped>
.scenarios-page {
  min-height: 100vh;
  background: #f1f5f9;
}

.top-bar {
  background: rgba(255, 255, 255, 0.96);
  padding: 14px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.06);
  position: sticky;
  top: 0;
  z-index: 10;
}

.brand {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.brand-name {
  color: #1e3a5f;
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.3px;
}

.brand-tagline {
  color: #94a3b8;
  font-size: 10px;
  font-weight: 500;
}

.student-area {
  display: flex;
  align-items: center;
  gap: 14px;
}

.student-badge {
  display: flex;
  align-items: center;
  gap: 8px;
}

.student-icon {
  width: 34px;
  height: 34px;
  background: #eff6ff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.student-badge div {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.student-label {
  color: #94a3b8;
  font-size: 9px;
  margin-bottom: 2px;
}

.student-badge strong {
  color: #1e3a5f;
  font-size: 12px;
}

.logout-btn {
  padding: 8px 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #475569;
  border-radius: 9px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.greeting { display: flex; align-items: center; gap: 8px; font-size: 16px; }
.logout-btn {
  padding: 8px 20px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}
.logout-btn:hover { background: #e2e8f0; }

.content { max-width: 800px; margin: 0 auto; padding: 32px 20px; }
.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 30px;
  margin-bottom: 28px;
}

.welcome-label {
  display: inline-block;
  color: #2563eb;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 7px;
}

h2 {
  color: #1e3a5f;
  margin: 0 0 7px 0;
  font-size: 28px;
  font-weight: 800;
}

.desc {
  color: #64748b;
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
}

.progress-mini {
  width: 145px;
  flex-shrink: 0;
  background: white;
  padding: 12px 14px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.progress-label {
  display: block;
  color: #94a3b8;
  font-size: 10px;
  margin-bottom: 2px;
}

.progress-mini strong {
  display: block;
  color: #1e3a5f;
  font-size: 18px;
  margin-bottom: 7px;
  direction: ltr;
  text-align: left;
}

.progress-track {
  width: 100%;
  height: 5px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  width: 10%;
  height: 100%;
  background: #2563eb;
  border-radius: 10px;
}
.loading { text-align: center; padding: 40px; color: #64748b; }

.scenarios-grid { display: flex; flex-direction: column; gap: 12px; }

.scenario-card {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  padding: 18px 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 72px;
  box-shadow: 0 3px 12px rgba(15, 23, 42, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.scenario-card:hover {
  border-color: rgba(37, 99, 235, 0.35);
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(37, 99, 235, 0.09);
}

.scenario-card.disabled {
  opacity: 0.7;
  pointer-events: none;
}

.scenario-number {
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 800;
  flex-shrink: 0;
}

.scenario-info {
  flex: 1;
  min-width: 0;
  text-align: right;
}

.session-label {
  display: block;
  color: #94a3b8;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.4px;
  margin-bottom: 3px;
}

.scenario-info h3 {
  margin: 0 0 3px 0;
  color: #1e3a5f;
  font-size: 15px;
  font-weight: 750;
  line-height: 1.3;
}

.title-ar {
  margin: 0 0 5px 0;
  color: #64748b;
  font-size: 11px;
  line-height: 1.3;
}

.scenario-meta {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
  color: #2563eb;
  font-size: 10px;
  line-height: 1.3;
}

.meta-dot {
  color: #cbd5e1;
}

.start-btn {
  padding: 9px 16px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 9px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.start-btn:hover:not(:disabled) {
  background: #1d4ed8;
  transform: translateX(-2px);
}


@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 600px) {
  .scenario-card { flex-wrap: wrap; }
  .start-btn { width: 100%; }
}
</style>
