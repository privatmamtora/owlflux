import { defineStore } from 'pinia'
import { useSettingsStore } from '../stores/settings'
import { MinifluxApi } from '../util/miniflux';
import { useTreeStore } from '../stores/tree'
import { useErrorStore } from '../stores/error'

export const useEntriesStore = defineStore({
  id: 'Entries',
  state: () => ({
    entries: [],
    selectedEntry: "",
    otherSelected: [],
    total: -1
  }),
  getters: {
    getSelectedEntries (state) {
      let items = [];
      if (state.selectedEntry) {
        items.push(state.entries.find(ent => ent.id == state.selectedEntry));
      }
      if (state.otherSelected && state.otherSelected.length) {
        items.push(state.entries.filter(ent => state.otherSelected.includes(ent.id + '')));
      }
      return items;
    },
    getSelectedEntry (state) {
      if (state.selectedEntry) {
        let entry = state.entries.find(ent => ent.id == state.selectedEntry);
        return entry;
      }
      return;
    },
    selectedContent (state) {
      if (state.selectedEntry) {
        let entry = state.entries.find(ent => ent.id == state.selectedEntry);
        return entry.content;
      }
      return '';
    },
    isSelected: (state) => {
      return (id) => {
        // console.log('Check if ' + id + ' is selected in', state.selectedEntry, state.otherSelected);
        if (state.selectedEntry == id) {
          // console.log('Selected Entry');
          return true;
        }
        if (state.otherSelected && state.otherSelected.length && state.otherSelected.includes(id + '')) {
          // console.log('Other Selected Entry');
          return true;
        }
        return false;
      }
    },
  },
  actions: {
    async loadMore() {
      try {
        const settingsStore = useSettingsStore();
        let options = { 'limit': 25, 'order': 'published_at', 'direction': 'desc' };

        if (this.total === -1) {
          console.log('First Load');
          options.limit = options.limit + 10;
        } else {
          if (this.entries.length >= this.total) {
            console.log(`All Loaded`);
            return;
          } else {
            console.log('Loading More...');
          }
        }
        // Load entries after current items
        if(this.entries && this.entries.length) {
          options['offset'] = this.entries.length;
        }

        // Update options from settingsStore
        if (settingsStore.settings['orderBy']) {
          options.order = settingsStore.settings['orderBy'];
        }
        if (settingsStore.settings['direction']) {
          options.direction = settingsStore.settings['direction'];
        }

        let miniflux = new MinifluxApi(settingsStore.settings.host, settingsStore.settings.key);
        let data;
        const treeStore = useTreeStore();

        if(treeStore.selectedItemData.type === 'feed') {
          console.log('Feed');

          data = await miniflux.getFeedEntries(treeStore.selectedItemData.id, options);
        } else if(treeStore.selectedItemData.type === 'category') {
          console.log('Category');

          options['category_id'] = treeStore.selectedItemData.id;
          data = await miniflux.getEntries(options);
        }

        if (!data) {
          throw new Error('Failed to load new Entries');
        }
        // console.log(this.entries);
        Array.prototype.push.apply(this.entries, data.entries);
        if (this.total === -1) {
          this.total = data.total;
        }
        console.log(this.entries);
      } catch (e) {
        const errorStore = useErrorStore();
        errorStore.setError(e, e.message);
        console.log(e);
      }
    }
  }
})
