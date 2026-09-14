import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import WelcomeView from '../views/WelcomeView.vue'
import ScenariosView from '../views/ScenariosView.vue'
import SystemCheckView from '../views/SystemCheckView.vue'
import SessionView from '../views/SessionView.vue'
import CompleteView from '../views/CompleteView.vue'

const routes = [
  { path: '/', name: 'login', component: LoginView, meta: { guest: true } },

  { path: '/welcome', name: 'welcome', component: WelcomeView, meta: { auth: true } },

  { path: '/scenarios', name: 'scenarios', component: ScenariosView, meta: { auth: true } },
  { path: '/check/:id', name: 'system-check', component: SystemCheckView, meta: { auth: true } },
  { path: '/session/:id', name: 'session', component: SessionView, meta: { auth: true } },
  { path: '/complete/:id', name: 'complete', component: CompleteView, meta: { auth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.auth && !token) return next('/')
if (to.meta.guest && token) return next('/welcome')
    next()
})

export default router
