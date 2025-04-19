<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand to="/">GUIVCard2</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <router-link class="nav-link" to="/contacts">Contacts</router-link>
        </b-navbar-nav>
        <b-navbar-nav class="ms-auto">
          <template v-if="!isAuthenticated">
            <b-button variant="outline-light" @click="showLoginModal">Login</b-button>
          </template>
          <template v-else>
            <span class="navbar-text me-3">{{ username }}</span>
            <b-button variant="outline-light" @click="logout">Logout</b-button>
          </template>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <div class="container mt-4">
      <router-view></router-view>
    </div>

    <!-- Login Modal -->
    <b-modal v-model="showLogin" title="Login to Radicale" @ok="login">
      <b-form @submit.prevent="login">
        <b-form-group label="Username" label-for="username">
          <b-form-input id="username" v-model="loginForm.username" required></b-form-input>
        </b-form-group>
        <b-form-group label="Password" label-for="password">
          <b-form-input id="password" type="password" v-model="loginForm.password" required></b-form-input>
        </b-form-group>
        <b-form-group label="Server URL" label-for="server">
          <b-form-input id="server" v-model="loginForm.server" required></b-form-input>
        </b-form-group>
      </b-form>
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