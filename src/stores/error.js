import { defineStore } from 'pinia'

export const useErrorStore = defineStore({
  id: 'Error',
  state: () => ({
    error: '',
    errorType: '',
    errorText: '',
  }),
  getters: {
    hasError: (state) => {
      if(state.error) {
        return true;
      }
      return false;
    },
    getMessage: (state) => {
      if(state.errorText) {
        return state.errorText;
      }
      return state.error.message;
    }
  },
  actions: {
    setError(e, errorText, errorType) {
      this.errorType = errorType;
      this.errorText = errorText;
      this.error = e;
    }
  }
})
