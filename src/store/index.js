import { createStore } from 'vuex'
import auth from './modules/auth'
import contacts from './modules/contacts'

export default createStore({
  modules: {
    auth,
    contacts
  },
  
  state: {
    loading: false,
    error: null
  },
  
  mutations: {
    SET_LOADING(state, value) {
      state.loading = value
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },
  
  actions: {
    setLoading({ commit }, value) {
      commit('SET_LOADING', value)
    },
    setError({ commit }, error) {
      commit('SET_ERROR', error)
    }
  },
  
  getters: {
    isLoading: state => state.loading,
    error: state => state.error
  }
})