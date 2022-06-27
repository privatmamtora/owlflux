import { defineStore } from 'pinia'

export const useEntriesStore = defineStore({
  id: 'Entries',
  state: () => ({
    entries: [],
  }),
  getters: {
    selectedText (state) {
      // if (state.selectedItem) {
      //   return state.selectedItem.querySelector('.label').innerText;
      // }
      return '';
    },
  },
})
