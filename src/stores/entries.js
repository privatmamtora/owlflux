import { defineStore } from 'pinia'

export const useEntriesStore = defineStore({
  id: 'Entries',
  state: () => ({
    entries: [],
    selectedEntry: "",
  }),
  getters: {
    selectedText (state) {
      // if (state.selectedItem) {
      //   return state.selectedItem.querySelector('.label').innerText;
      // }
      return '';
    },
    selectedContent (state) {
      if (state.selectedEntry) {
        let entry = state.entries.entries.find(ent => ent.id == state.selectedEntry);
        return entry.content;
      }
      return '';
    },
  },
})
