import { createDAVClient } from 'tsdav'

export default {
  namespaced: true,

  state: {
    isAuthenticated: false,
    username: null,
    client: null,
    serverUrl: null
  },

  mutations: {
    SET_AUTH(state, { username, client, serverUrl }) {
      state.isAuthenticated = true
      state.username = username
      state.client = client
      state.serverUrl = serverUrl
    },
    CLEAR_AUTH(state) {
      state.isAuthenticated = false
      state.username = null
      state.client = null
      state.serverUrl = null
    }
  },

  actions: {
    async login({ commit }, { username, password, server }) {
      try {
        const client = await createDAVClient({
          serverUrl: server,
          credentials: {
            username,
            password
          },
          authMethod: 'Basic',
          defaultAccountType: 'carddav'
        })

        // Test connection by fetching addressbooks
        await client.fetchAddressBooks()

        commit('SET_AUTH', {
          username,
          client,
          serverUrl: server
        })

        // Initialize contacts after successful login
        await this.dispatch('contacts/initializeContacts', client)

        return true
      } catch (error) {
        console.error('Login failed:', error)
        throw error
      }
    },

    logout({ commit }) {
      commit('CLEAR_AUTH')
      this.dispatch('contacts/clearContacts')
    }
  },

  getters: {
    isAuthenticated: state => state.isAuthenticated,
    username: state => state.username,
    client: state => state.client,
    serverUrl: state => state.serverUrl
  }
}