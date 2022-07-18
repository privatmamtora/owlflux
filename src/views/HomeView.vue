<script setup>
import 'splitpanes/dist/splitpanes.css'
import { Splitpanes, Pane } from 'splitpanes'
import { watch, ref } from 'vue'
import { useDisplay } from 'vuetify'

import { useSettingsStore } from '../stores/settings'
import { useTreeStore } from '../stores/tree'
import { useEntriesStore } from '../stores/entries'
import { useErrorStore } from '../stores/error'

import TreeList from "../components/TreeList.vue";
import EntryList from "../components/EntryList.vue";
import Entry from "../components/Entry.vue";

const settingsStore = useSettingsStore();
const treeStore = useTreeStore();
const entriesStore = useEntriesStore();
const errorStore = useErrorStore();

const { mobile } = useDisplay()

let drawer = ref(false);
let group = ref(null);
watch(group, () => drawer.value = false);

// let showError = ref(false);
// let errorType = ref("");
// let errorText = ref("");

let paneSize1 = ref(settingsStore.settings.paneSize ? settingsStore.settings.paneSize[0].size : 30);
let paneSize2 = ref(settingsStore.settings.paneSize ? settingsStore.settings.paneSize[1].size : 30);
function saveSize(name, e) {
  settingsStore.settings['paneSize'] = e;
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
    <v-toolbar-title>{{ treeStore.selectedText }}</v-toolbar-title>
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
            <div class="d-flex flex-column justify-space-between" style="min-height: 100%;">
              <TreeList class=""/>
              <v-btn append-icon="mdi-cog" to="/settings">Settings</v-btn>
            </div>
        </Pane>
        <Pane min-size="30" :size="paneSize2">
          <EntryList v-if="treeStore.selectedText" :selected-feed="treeStore.selectedItemData" />
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

  .splitpanes.default-theme .splitpanes__pane {
    background-color: unset;
  }
  .splitpanes.default-theme .splitpanes__splitter {
    --v-theme-overlay-multiplier: var(--v-theme-surface-variant-overlay-multiplier);
    background-color: rgb(var(--v-theme-surface-variant)) !important;
  }
  .splitpanes.default-theme .splitpanes__splitter:before,
  .splitpanes.default-theme .splitpanes__splitter:after {
    --v-theme-overlay-multiplier: var(--v-theme-surface-overlay-multiplier);
    background-color: rgb(var(--v-theme-surface)) !important;
  }
  .splitpanes.default-theme .splitpanes__splitter:hover:before,
  .splitpanes.default-theme .splitpanes__splitter:hover:after {
    --v-theme-overlay-multiplier: var(--v-theme-surface-overlay-multiplier);
    background-color: rgb(var(--v-theme-surface)) !important;
  }
  .default-theme.splitpanes--vertical > .splitpanes__splitter,
  .default-theme .splitpanes--vertical > .splitpanes__splitter {
    --v-theme-overlay-multiplier: var(--v-theme-surface-variant-overlay-multiplier);
    border-left-color: rgb(var(--v-theme-surface-variant)) !important;
  }
  .default-theme.splitpanes--horizontal > .splitpanes__splitter,
  .default-theme .splitpanes--horizontal > .splitpanes__splitter {
    --v-theme-overlay-multiplier: var(--v-theme-surface-variant-overlay-multiplier);
    border-left-color: rgb(var(--v-theme-surface-variant)) !important;
  }


</style>
