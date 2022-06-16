import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useSettingsStore = defineStore({
  id: 'settings',
  state: () => ({
    settings: useStorage('settings', {})
  }),
  getters: {
    getSettings: (state) => {state.settings}
  },
  actions: {
    setSettings(state, settings) {
      state.settings = settings
    }
  }
})
