<script setup>
import 'splitpanes/dist/splitpanes.css'
import { Splitpanes, Pane } from 'splitpanes'
import { watch, ref } from 'vue'
import { useDisplay } from 'vuetify'

import { storeToRefs } from 'pinia'
import { useSettingsStore } from '../stores/settings'
import { useTreeStore } from '../stores/tree'
import { useEntriesStore } from '../stores/entries'
import { useErrorStore } from '../stores/error'

import TreeList from "../components/TreeList.vue";
import EntriesList from "../components/EntriesList.vue";
import Entry from "../components/Entry.vue";

const settingsStore = useSettingsStore();
const treeStore = useTreeStore();
const entriesStore = useEntriesStore();
const errorStore = useErrorStore();

let { settings } = storeToRefs(settingsStore);
let { selectedText, selectedItemData } = storeToRefs(treeStore);

const { mobile } = useDisplay()

let drawer = ref(false);
let group = ref(null);
watch(group, () => drawer.value = false);

// let showError = ref(false);
// let errorType = ref("");
// let errorText = ref("");

let paneSize1 = ref(settings.value.paneSize ? settings.value.paneSize[0].size : 30);
let paneSize2 = ref(settings.value.paneSize ? settings.value.paneSize[1].size : 30);
function saveSize(name, e) {
  settings.value.paneSize = e;
}

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
      v-show="errorStore.hasError"
      density="compact"
      :title="errorStore.errorType"
      prominent
      type="error">{{errorStore.getMessage}}</v-alert>
    <template v-if="!mobile">
      <Splitpanes class="default-theme" @resized="saveSize('resized', $event)">
        <Pane min-size="20" :size="paneSize1">
          <v-card>
            <TreeList expanded />
          </v-card>
        </Pane>
        <Pane min-size="30" :size="paneSize2">
          <EntriesList v-if="selectedText" :selected-feed="selectedItemData" />
        </Pane>
        <Pane min-size="30" :size="100-paneSize1-paneSize2">
          <Entry v-if="entriesStore.selectedEntry" :selected-entry="entriesStore.getSelectedEntry" />
        </Pane>
      </Splitpanes>
    </template>
    <template v-else>
      <div>Mobile</div>
    </template>
  </v-main>
</template>

<style type="text/css">
.splitpanes__pane {
  overflow: auto;
}

main {
  height: 0vh;
}

.icon {
  height: 1em;
  max-width: 100%;
}
</style>
