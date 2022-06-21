<script setup>
import 'splitpanes/dist/splitpanes.css'
import { Splitpanes, Pane } from 'splitpanes'
import { watch, ref } from 'vue'

import { storeToRefs } from 'pinia'
import { useSettingsStore } from '../stores/settings'
import { useTreeStore } from '../stores/tree'
import { MinifluxApi } from '../util/miniflux';

// import TreeNode from "../components/TreeNode.vue";
import Tree from "../components/Tree.vue";

const settingsStore = useSettingsStore();
const treeStore = useTreeStore();
let { settings } = storeToRefs(settingsStore);
let { selectedItem, selectedText } = storeToRefs(treeStore);

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

let feedTree = ref({});

let paneSize1 = ref(settings.value.paneSize ? settings.value.paneSize[0].size : 30);
let paneSize2 = ref(settings.value.paneSize ? settings.value.paneSize[1].size : 30);
function saveSize(name, e) {
  console.log(`${name}: ${JSON.stringify(e)}`);
  settings.value.paneSize = e;
}

const init = async () => {
  try {
    const miniflux = new MinifluxApi(settings.value.host, settings.value.key);

    let feeds = await miniflux.getFeeds();
    console.log(await miniflux.me());
    console.log(feeds);



  } catch (e) {
    showError.value = true;
    errorType.value = e.title;
    errorText.value = e.message;
    console.log(e);
  }
}
init();

const tree = {
  label: "A cool folder",
  children: [
    {
      label: "A cool sub-folder 1",
      children: [
        { label: "A cool sub-sub-folder 1" },
        { label: "A cool sub-sub-folder 2" }
      ]
    },
    { label: "This one is not that cool" }
  ]
}

const nodes = [
        {
          id: 1,
          label: 'Foods',
          children: [
            {
              id: 2,
              label: 'Fruits',
              children: [
                {
                  id: 3,
                  label: 'Banana'
                },
                {
                  id: 4,
                  label: 'Apple'
                },
                {
                  id: 5,
                  label: 'Strawberry'
                }
              ]
            },
            {
              id: 6,
              label: 'Vegetables',
              children: [
                {
                  id: 7,
                  label: 'Carrot'
                },
                {
                  id: 8,
                  label: 'Lettuce'
                },
                {
                  id: 9,
                  label: 'Potato'
                }
              ]
            }
          ]
        },
        {
          id: 10,
          label: 'Drinks',
          children: [
            {
              id: 11,
              label: 'Beers',
              children: [
                {
                  id: 12,
                  label: 'Budweiser'
                },
                {
                  id: 13,
                  label: 'Heineken'
                }
              ]
            },
            {
              id: 14,
              label: 'Wines'
            },
            {
              id: 15,
              label: 'Whiskey'
            }
          ]
        }
      ];

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
      <Splitpanes class="default-theme" @resized="saveSize('resized', $event)">
        <Pane min-size="20" :size="paneSize1">
          <div>1: {{ selectedText }}</div>
          <v-card>
            <Tree :tree-data="nodes" />
          </v-card>
        </Pane>
        <Pane min-size="30" :size="paneSize2">
          <div>2</div>
        </Pane>
        <Pane min-size="30" :size="100-paneSize1-paneSize2">
          <div>3</div>
        </Pane>
      </Splitpanes>
  </v-main>
</template>
