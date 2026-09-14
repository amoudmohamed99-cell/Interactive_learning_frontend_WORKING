<template>
  <div class="complete-page">
    <div class="complete-card">
      <div class="success-icon">🎉</div>
      <h1>أحسنت! أنهيت الجلسة</h1>
      <p class="subtitle">ممتاز! كل مرة بتتحسن أكتر 💪</p>

<div class="stats">
  <div class="stat-item">
    <span class="stat-icon">💬</span>
    <span class="stat-value">{{ stats.turns }}</span>
    <span class="stat-label">أدوار حوارية</span>
  </div>

  <div class="stat-item">
    <span class="stat-icon">⏱️</span>
    <span class="stat-value">{{ stats.duration }}</span>
    <span class="stat-label">مدة الجلسة</span>
  </div>
</div>

<div class="session-message">
  <span class="message-icon">✨</span>
  <div>
    <strong>Keep practicing!</strong>
    <p>Every conversation is a step forward.</p>
  </div>
</div>

      <button @click="router.push('/scenarios')" class="back-btn">
        ← ارجع للسيناريوهات
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api'

const route = useRoute()
const router = useRouter()
const sessionId = route.params.id

const stats = ref({
  turns: localStorage.getItem('last_turns') || '0',
  duration: localStorage.getItem('last_duration') || '-',
  correct: localStorage.getItem('last_correct') || '0'
})

onMounted(async () => {
  // Try to get real stats from API
  if (sessionId) {
    try {
      const { data } = await api.get(`/sessions/${sessionId}`)
      const session = data?.data?.session || data?.session || {}
      const turns = data?.data?.turns || []
      
      const studentTurns = turns.filter(t => t.speaker === 'student').length
      if (studentTurns > 0) stats.value.turns = String(studentTurns)
      
      if (session.duration_seconds) {
        const mins = Math.floor(session.duration_seconds / 60)
        const secs = session.duration_seconds % 60
        stats.value.duration = `${mins}:${String(secs).padStart(2, '0')}`
      }
    } catch(e) { /* use localStorage fallback */ }
  }
})
</script>

<style scoped>
.complete-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  padding: 20px;
}

.complete-card {
  background: white;
  border-radius: 24px;
  padding: 48px 40px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  text-align: center;
}

.success-icon { font-size: 64px; margin-bottom: 16px; }

h1 { color: #065f46; font-size: 24px; margin: 0 0 8px; }
.subtitle { color: #64748b; font-size: 16px; margin: 0 0 32px; }

.stats {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.stat-item {
  background: #f0fdf4;
  padding: 16px 20px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100px;
}

.stat-value { font-size: 28px; font-weight: 700; color: #059669; direction: ltr; }
.stat-label { font-size: 13px; color: #64748b; margin-top: 4px; }

.back-btn {
  width: 100%;
  padding: 14px;
  background: #059669;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover { background: #047857; transform: translateY(-1px); }
.session-message {
  direction: ltr;
  text-align: center;
}

.session-message strong,
.session-message p {
  direction: ltr;
  text-align: center;
}
</style>
