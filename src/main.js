import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import { createBootstrap } from 'bootstrap-vue-next'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

import {
  BModal,
  BButton,
  BForm,
  BFormInput,
  BFormGroup,
  BNavbar,
  BNavbarToggle,
  BCollapse
} from 'bootstrap-vue-next'

const app = createApp(App)

// Register BootstrapVue components
app.component('BModal', BModal)
app.component('BButton', BButton)
app.component('BForm', BForm)
app.component('BFormInput', BFormInput)
app.component('BFormGroup', BFormGroup)
app.component('BNavbar', BNavbar)
app.component('BNavbarToggle', BNavbarToggle)
app.component('BCollapse', BCollapse)

app.use(store)
app.use(router)
app.use(createBootstrap())

// Global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue Error:', err)
  console.error('Component:', vm)
  console.error('Info:', info)
}

// Production error handling
if (process.env.NODE_ENV === 'production') {
  window.onerror = function(msg, url, line, col, error) {
    console.error('Global Error:', {msg, url, line, col, error})
    return false
  }
}

app.mount('#app')