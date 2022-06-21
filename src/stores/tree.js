import { defineStore } from 'pinia'

export const useTreeStore = defineStore({
  id: 'Tree',
  state: () => ({
    selectedItem: false
  }),
  getters: {
    selectedText (state) {
      if (state.selectedItem) {
        return state.selectedItem.querySelector('.label').innerText;
      }
      return '';
    }
  },
})
