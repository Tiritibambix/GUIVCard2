import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import { BootstrapVue } from 'bootstrap-vue-next'

// Import Bootstrap and BootstrapVue CSS files
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

const app = createApp(App)

app.use(store)
app.use(router)
app.use(BootstrapVue)

app.mount('#app')