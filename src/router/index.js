import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

// Lazy load components
const ContactsList = () => import('../views/ContactsList.vue')
const ContactDetails = () => import('../views/ContactDetails.vue')
const ContactEdit = () => import('../views/ContactEdit.vue')

const routes = [
  {
    path: '/',
    redirect: '/contacts'
  },
  {
    path: '/contacts',
    name: 'contacts',
    component: ContactsList,
    meta: { requiresAuth: true }
  },
  {
    path: '/contacts/:id',
    name: 'contact-details',
    component: ContactDetails,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/contacts/:id/edit',
    name: 'contact-edit',
    component: ContactEdit,
    meta: { requiresAuth: true },
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters['auth/isAuthenticated']) {
      // Save intended destination
      store.dispatch('setIntendedRoute', to.fullPath)
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router