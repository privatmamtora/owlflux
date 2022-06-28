<script setup>
import 'splitpanes/dist/splitpanes.css'
import { Splitpanes, Pane } from 'splitpanes'
import { watch, ref, computed } from 'vue'

import { storeToRefs } from 'pinia'
import { useSettingsStore } from '../stores/settings'
import { useTreeStore } from '../stores/tree'
import { useEntriesStore } from '../stores/entries'
import { MinifluxApi } from '../util/miniflux';

import TreeList from "../components/TreeList.vue";
import EntriesList from "../components/EntriesList.vue";

const settingsStore = useSettingsStore();
const treeStore = useTreeStore();
const entriesStore = useEntriesStore();

let { settings } = storeToRefs(settingsStore);
let { selectedText, iconData, selectedItemData } = storeToRefs(treeStore);

let drawer = ref(false);
let group = ref(null);
watch(group, () => drawer.value = false);

let showError = ref(false);
let errorType = ref("");
let errorText = ref("");

let paneSize1 = ref(settings.value.paneSize ? settings.value.paneSize[0].size : 30);
let paneSize2 = ref(settings.value.paneSize ? settings.value.paneSize[1].size : 30);
function saveSize(name, e) {
  settings.value.paneSize = e;
}

let miniflux;
try {
  miniflux = new MinifluxApi(settings.value.host, settings.value.key);
} catch (e) {
  showError.value = true;
  errorType.value = e.title;
  errorText.value = e.message;
  console.log(e);
}

watch(selectedItemData, (newValue) => {
  console.log('new', newValue);
  if(treeStore.selectedItemData.type === 'feed') {
    console.log('Feed');
    miniflux.getFeedEntries(treeStore.selectedItemData.id, { 'limit': 25, 'order': 'published_at', 'direction': 'desc' })
    .then(data => {
      console.log(data);
      entriesStore.entries = data;
    });
  } else if(treeStore.selectedItemData.type === 'category') {
    console.log('Category');
    miniflux.getEntries({ 'category_id': newValue.id, 'limit': 25, 'order': 'published_at', 'direction': 'desc' })
    .then(data => {      
      console.log(data);
      entriesStore.entries = data;
    });
  }
});

const init = async () => {
  try {
    let feeds = await miniflux.getFeeds();
    console.log(await miniflux.me());
    console.log(feeds);
    let categories = [];

    let currentIcons = iconData.value || [];
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
      iconData.value = currentIcons.concat(newIconSet);
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
          feed.icon.data = 'data:' + treeStore.getIconById(feed.icon.icon_id).data;
        }
        children.push(feed);
      }
      cat.children = children;
      feedTree.push(cat);
    }
    treeStore.treeData = feedTree;
    console.log(feedTree);

    let counters = await miniflux.getFeedCounters();
    treeStore.unreadCounters = counters.unreads;
    console.log(counters);

  } catch (e) {
    showError.value = true;
    errorType.value = e.title;
    errorText.value = e.message;
    console.log(e);
  }
}
init();

</script>

<template>
  <!-- <v-navigation-drawer v-model="drawer" app>
    <v-list-item>
      <v-list-item-title>OwlFlux</v-list-item-title>
      <v-btn class="ml-auto" to="/settings">
      <v-list-item-icon class="ml-auto">mdi-cog</v-list-item-icon>
    </v-btn>
    </v-list-item>
    <v-list
      :items="items"
    ></v-list>
  </v-navigation-drawer> -->
  <v-app-bar density="compact">
    <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    <v-toolbar-title>{{ selectedText }}</v-toolbar-title>
  </v-app-bar>
  <v-main>
    <v-alert 
      v-show="showError"
      density="compact"
      :title="errorType"
      prominent
      type="error">{{errorText}}</v-alert>
    <Splitpanes class="default-theme" @resized="saveSize('resized', $event)">
      <Pane min-size="20" :size="paneSize1">
        <v-card>
          <TreeList :tree-data="treeStore.treeData" expanded />
        </v-card>
      </Pane>
      <Pane min-size="30" :size="paneSize2">
        <EntriesList v-if="selectedText" :data="entriesStore.entries" />
      </Pane>
      <Pane min-size="30" :size="100-paneSize1-paneSize2">
        <v-card v-html="entriesStore.selectedEntry.content"></v-card>
      </Pane>
    </Splitpanes>
  </v-main>
</template>

<style type="text/css">
.splitpanes__pane {
  overflow: auto;
}

main {
  height: 0vh;
}
</style>
