import { reactive } from 'vue'

const state = reactive({
  user: null,
  isAdmin: false
})

const getters = {
  isLoggedIn: () => !!state.user,
  isAdmin: () => state.isAdmin,
  currentUser: () => state.user
}

const actions = {
  setUser(user) {
    state.user = user
  },
  setAdmin(isAdmin) {
    state.isAdmin = isAdmin
  },
  logout() {
    state.user = null
    state.isAdmin = false
  }
}

export default {
  state,
  getters,
  ...actions
}
