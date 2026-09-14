<template>
  <div class="login-page">
    <div class="login-card">
      <div class="avatar-icon">🤖</div>
      <h1>بيئة التعلم التفاعلية</h1>
      <p class="subtitle">تعلّم الإنجليزية مع أحمد</p>

      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <input
            v-model="code"
            type="text"
            placeholder="أدخل الكود الخاص بك"
            :disabled="loading"
            maxlength="8"
            dir="ltr"
            autofocus
          />
        </div>

        <div v-if="error" class="error-msg">{{ error }}</div>

        <button type="submit" :disabled="loading || !code.trim()">
          <span v-if="loading" class="spinner"></span>
          <span v-else>دخول</span>
        </button>
      </form>
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
    error.value = e.response?.data?.message || 'الكود غير صحيح. حاول مرة تانية.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 24px;
  padding: 48px 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  text-align: center;
}

.avatar-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

h1 {
  color: #1e3a5f;
  font-size: 24px;
  margin: 0 0 8px 0;
}

.subtitle {
  color: #64748b;
  font-size: 16px;
  margin: 0 0 32px 0;
}

.input-group input {
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 18px;
  text-align: center;
  letter-spacing: 4px;
  font-weight: 600;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.input-group input:focus {
  outline: none;
  border-color: #2563eb;
}

.error-msg {
  color: #dc2626;
  font-size: 14px;
  margin: 12px 0;
  padding: 8px;
  background: #fef2f2;
  border-radius: 8px;
}

button {
  width: 100%;
  padding: 14px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 20px;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

button:hover:not(:disabled) { background: #1d4ed8; }
button:disabled { opacity: 0.6; cursor: not-allowed; }

.spinner {
  width: 20px; height: 20px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
