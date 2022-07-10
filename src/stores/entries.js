import { defineStore } from 'pinia'

export const useEntriesStore = defineStore({
  id: 'Entries',
  state: () => ({
    entries: [],
    selectedEntry: "",
    otherSelected: [],
  }),
  getters: {
    getSelectedEntries (state) {
      let items = [];
      if (state.selectedEntry) {
        items.push(state.entries.entries.find(ent => ent.id == state.selectedEntry));
      }
      if (state.otherSelected && state.otherSelected.length) {
        items.push(state.entries.entries.filter(ent => state.otherSelected.includes(ent.id)));
      }
      return items;
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
