import { defineStore } from 'pinia'

export const useTreeStore = defineStore({
  id: 'Tree',
  state: () => ({
    selectedItem: false
  }),
  getters: {
    selectedText (state) {
      return state.selectedItem.innerText;
    }
  },
})
