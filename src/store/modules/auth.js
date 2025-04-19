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
        const addressBooks = await client.fetchAddressBooks()
        
        // Find specific addressbook using env variable
        const addressBookPath = process.env.VUE_APP_RADICALE_PATH || ''
        const targetAddressBook = addressBookPath ?
          addressBooks.find(ab => ab.url.endsWith(addressBookPath)) :
          addressBooks[0]

        if (!targetAddressBook) {
          throw new Error('AddressBook not found')
        }

        commit('SET_AUTH', {
          username,
          client,
          serverUrl: server,
          addressBook: targetAddressBook
        })

        // Initialize contacts after successful login with specific addressbook
        await this.dispatch('contacts/initializeContacts', { client, addressBook: targetAddressBook })

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