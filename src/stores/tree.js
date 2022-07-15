import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

import { useSettingsStore } from '../stores/settings';
import { useErrorStore } from '../stores/error'
import { MinifluxApi } from '../util/miniflux';

export const useTreeStore = defineStore({
  id: 'Tree',
  state: () => ({
    selectedItemData: {},
    treeData: {},
    iconData: useStorage('icon-data', []),
    unreadCounters: {}
  }),
  getters: {
    selectedText (state) {
      if (state.selectedItemData && state.selectedItemData.title) {
        return state.selectedItemData.title;
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
  actions: {
    async load() {
      try {
        const settingsStore = useSettingsStore();

        let miniflux = new MinifluxApi(settingsStore.settings.host, settingsStore.settings.key);
        let feeds = await miniflux.getFeeds();
        console.log(await miniflux.me());
        console.log(feeds);
        let categories = [];

        let currentIcons = this.iconData || [];
        let getIcons = [];

        for (let feed of feeds) {
          // Find unique categories
          if (!categories.find((c) => c.id === feed.category.id)) {
            let cat = feed.category;
            cat.type = "category";
            categories.push(cat);
          }
          // Check if Icon cached
          if (feed.icon) {
            if (!currentIcons.find((i) => i.id === feed.icon.icon_id)) {
              getIcons.push(miniflux.getFeedIcon(feed.id));
            }
          }
        }
        if (getIcons.length) {
          let newIconSet = await Promise.all(getIcons);
          Array.prototype.push.apply(this.iconData, newIconSet);
        }

        const feedTree = [
          { id: -1, title: 'All' },
          {
            id: -2,
            title: 'Starred'
          },
        ];

        categories.sort((a, b) => a.title.localeCompare(b.title));
        for(let cat of categories) {
          let children = [];
          let catFeeds = feeds.filter((f) => f.category.id === cat.id)
                              .sort((a, b) => a.title.localeCompare(b.title));
          for(let feed of catFeeds) {
            feed.type = "feed";
            if (feed.icon) {
              feed.icon.data = 'data:' + this.getIconById(feed.icon.icon_id).data;
            }
            children.push(feed);
          }
          cat.children = children;
          feedTree.push(cat);
        }
        this.treeData = feedTree;
        console.log(feedTree);

        let counters = await miniflux.getFeedCounters();
        this.unreadCounters = counters.unreads;
        console.log(counters);
      } catch(e) {
        const errorStore = useErrorStore();
        errorStore.setError(e, e.message);
        console.log(e);
      }
    }
  }
})
