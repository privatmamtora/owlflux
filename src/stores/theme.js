import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useThemeStore = defineStore({
  id: 'theme',
  state: () => ({
    themeColor: useStorage('theme', 'light')
  }),
  getters: {
    getThemeColor: (state) => {state.themeColor}
  },
  actions: {
    setThemeColor(state, color) {
      state.themeColor = color
    }
  }
})
