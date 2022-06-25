import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useTreeStore = defineStore({
  id: 'Tree',
  state: () => ({
    selectedItem: false,
    treeData: {},
    iconData: useStorage('icon-data', []),
    unreadCounters: {}
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
    unreadCounterById: (state) => {
      return (feedId) => {
        return state.unreadCounters[feedId];
      }
    },
  },
})
