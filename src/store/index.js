import { createStore } from 'vuex'
const ACCESS_TOKEN = 'ACCESS_TOKEN';
export default createStore({
  state: {
    accessToken: localStorage.getItem(ACCESS_TOKEN),
    username:  localStorage.getItem('username'),
    userId: localStorage.getItem('user'),
    customerId: localStorage.getItem('customer')
  },
  getters: {
    isAuthenticated(state) {
      return state.accessToken
    }
  },
  mutations: {
    auth(state, payload) {
      state.accessToken = payload.accessToken

      if (payload.accessToken) {
        localStorage.setItem(ACCESS_TOKEN, payload.accessToken);
        localStorage.setItem('username', payload.username);

        state.username = payload.username
        if (payload.user) {
          localStorage.setItem('user', payload.user.id);
          state.userId = payload.user.id
        }

        if (payload.customer) {
          localStorage.setItem('customer', payload.customer.id);
          state.customerId = payload.customer.id
        }
      } else {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem('username');
      }
    },
    logout(state) {
      console.log('logout')
      console.log(state.accessToken)
      state.accessToken = ''
      state.username = ''
      state.userId = ''
      state.customerId = ''
      localStorage.removeItem(ACCESS_TOKEN)
      localStorage.removeItem('username')
      localStorage.removeItem('user')
      localStorage.removeItem('customer')
    }
  },
  actions: {
  },
  modules: {
  }
})
