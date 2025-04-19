<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">GUIVCard2</router-link>
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" to="/contacts">Contacts</router-link>
            </li>
          </ul>
          <div class="d-flex" v-if="!isAuthenticated">
            <button class="btn btn-outline-light" @click="showLoginModal">Login</button>
          </div>
          <div class="d-flex" v-else>
            <span class="navbar-text me-3">{{ username }}</span>
            <button class="btn btn-outline-light" @click="logout">Logout</button>
          </div>
        </div>
      </div>
    </nav>

    <div class="container mt-4">
      <router-view></router-view>
    </div>

    <!-- Login Modal -->
    <b-modal v-model="showLogin" title="Login to Radicale" @ok="login">
      <form @submit.prevent="login">
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input type="text" class="form-control" id="username" v-model="loginForm.username">
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input type="password" class="form-control" id="password" v-model="loginForm.password">
        </div>
        <div class="mb-3">
          <label for="server" class="form-label">Server URL</label>
          <input type="text" class="form-control" id="server" v-model="loginForm.server">
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'App',
  setup() {
    const store = useStore()
    const showLogin = ref(false)
    const loginForm = ref({
      username: process.env.VUE_APP_DEFAULT_USERNAME || '',
      password: process.env.VUE_APP_DEFAULT_PASSWORD || '',
      server: process.env.VUE_APP_RADICALE_URL || ''
    })

    const isAuthenticated = computed(() => store.state.auth.isAuthenticated)
    const username = computed(() => store.state.auth.username)

    const showLoginModal = () => {
      showLogin.value = true
    }

    const login = async () => {
      try {
        await store.dispatch('auth/login', loginForm.value)
        showLogin.value = false
      } catch (error) {
        console.error('Login failed:', error)
      }
    }

    const logout = () => {
      store.dispatch('auth/logout')
    }

    return {
      showLogin,
      loginForm,
      isAuthenticated,
      username,
      showLoginModal,
      login,
      logout
    }
  }
}
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>