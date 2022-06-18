<script setup>
import 'splitpanes/dist/splitpanes.css'
import { Splitpanes, Pane } from 'splitpanes'
import { watch, ref } from 'vue'

import { storeToRefs } from 'pinia'
import { useSettingsStore } from '../stores/settings'

import { MinifluxApi } from '../util/miniflux';

const settingsStore = useSettingsStore();
let { settings } = storeToRefs(settingsStore);

const items = [
      {
        title: 'Foo',
        value: 'foo',
      },
      {
        title: 'Bar',
        value: 'bar',
      },
      {
        title: 'Fizz',
        value: 'fizz',
      },
      {
        title: 'Buzz',
        value: 'buzz',
      }
];
let drawer = ref(false);
let group = ref(null);
watch(group, () => drawer.value = false);

let showError = ref(false);
let errorType = ref("");
let errorText = ref("");

let navData = ref({});

const init = async () => {
  try {
    const miniflux = new MinifluxApi(settings.value.host, settings.value.key);
    console.log(await miniflux.getFeeds());
    console.log(await miniflux.me());
    console.log(await miniflux.exportFeeds());
    console.log(await miniflux.getFeed(1));
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
    <v-navigation-drawer v-model="drawer" app>
      <v-list-item>
        <v-list-item-title>OwlFlux</v-list-item-title>
        <v-btn class="ml-auto" to="/settings">
        <v-list-item-icon class="ml-auto">mdi-cog</v-list-item-icon>
      </v-btn>
      </v-list-item>
      <v-list
        :items="items"
      ></v-list>
    </v-navigation-drawer>
    <v-app-bar density="compact">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>My files</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-alert 
        v-show="showError"
        density="compact"
        :title="errorType"
        prominent
        type="error">{{errorText}}</v-alert>
      <Splitpanes class="default-theme">
        <Pane min-size="30">
          <div>1</div>
        </Pane>
        <Pane min-size="30">
          <div>2</div>
        </Pane>
      </Splitpanes>
  </v-main>
</template>
