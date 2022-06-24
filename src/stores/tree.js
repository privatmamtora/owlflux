import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useTreeStore = defineStore({
  id: 'Tree',
  state: () => ({
    selectedItem: false,
    first: true,
    treeData: {},
    iconData: useStorage('icon-data', [])
  }),
  getters: {
    selectedText (state) {
      if (state.selectedItem) {
        return state.selectedItem.querySelector('.label').innerText;
      }
      return '';
    },
    getIconById: (state) => {
      return (iconId) => {
        return state.iconData.find((icon) => icon.id === iconId);
      }
    },
  },
})
