import { defineStore } from 'pinia'

export const useTreeStore = defineStore({
  id: 'Tree',
  state: () => ({
    selectedItem: false,
    first: true,
    treeData: {},
    iconData: []
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
