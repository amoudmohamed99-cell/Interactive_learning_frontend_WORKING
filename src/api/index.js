import axios from 'axios'

// Production: direct to Railway backend
// Local dev: VITE_API_URL not set → uses /api/v1 (proxied by Vite)
export const API_URL = import.meta.env.VITE_API_URL
  || (import.meta.env.DEV ? '/api/v1' : 'https://interactivelearning-production.up.railway.app/api/v1')

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
})

// Add token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auth
export const login = async (code) => {
  const { data } = await api.post('/auth/login', { code })
  localStorage.setItem('token', data.token)
  localStorage.setItem('student', JSON.stringify(data.student))
  localStorage.setItem('student_code', data.student?.code || code)
  return data
}

export const logout = async () => {
  try { await api.post('/auth/logout') } catch (e) { /* ignore */ }
  localStorage.removeItem('token')
  localStorage.removeItem('student')
}

// Scenarios
export const getScenarios = () => api.get('/scenarios').then(r => r.data)
export const getScenario = (id) => api.get(`/scenarios/${id}`).then(r => r.data)

// Sessions
export const getSessions = () => api.get('/sessions').then(r => r.data)
export const createSession = (scenario_id, session_number = 1) =>
  api.post('/sessions', { scenario_id, session_number }).then(r => r.data)
export const startSession = (id) => api.post(`/sessions/${id}/start`).then(r => r.data)
export const speak = (id, text, confidence = 0.9) =>
  api.post(`/sessions/${id}/speak`, { text, confidence }).then(r => r.data)
export const endSession = (id) => api.post(`/sessions/${id}/end`).then(r => r.data)
export const getPhase = (id) => api.get(`/sessions/${id}/phase`).then(r => r.data)
export const advancePhase = (id) => api.post(`/sessions/${id}/advance-phase`).then(r => r.data)

// Simli Avatar
export const getSimliToken = () => api.get('/simli/token').then(r => r.data)
export const getSimliIce = () => api.get('/simli/ice').then(r => r.data)

export default api
