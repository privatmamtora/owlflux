<script setup>
import { useSettingsStore } from '../stores/settings'

import CustomSelect from "../components/CustomSelect.vue";

import { MinifluxApi } from '../util/miniflux';

const settingsStore = useSettingsStore();

let orderSelected = 0;
if (settingsStore.settings['orderBy']) {
  orderSelected = MinifluxApi.orderOptions.findIndex(o => o.value === settingsStore.settings['orderBy']);
}

let directionSelected = 0;
if (settingsStore.settings['direction']) {
  directionSelected = MinifluxApi.directionOptions.findIndex(o => o.value === settingsStore.settings['direction']);
}

function orderUpdated(index) {
  let newOrder = MinifluxApi.orderOptions[index].value;
  if (settingsStore.settings['orderBy'] !== newOrder) {
    settingsStore.settings['orderBy'] = newOrder;
  }
}

function directionUpdated(index) {
  let newValue = MinifluxApi.directionOptions[index].value;
  if (settingsStore.settings['direction'] !== newValue) {
    settingsStore.settings['direction'] = newValue;
  }
}

</script>

<template>
  <v-container>
    <div>List</div>
    <v-select
      label="Sort Order"
      variant="outlined"
      shaped
      :value="MinifluxApi.orderOptions[0]"
      :items="MinifluxApi.orderOptions"
      item-title="name"
      item-value="value"></v-select>
    <CustomSelect
      :options="MinifluxApi.orderOptions.map(o => o.name)"
      @update:selected="orderUpdated"
      label="Sort Order"
      :selectedIndex="orderSelected">
    </CustomSelect>
    <CustomSelect
      :options="MinifluxApi.directionOptions.map(o => o.name)"
      @update:selected="directionUpdated"
      label="Sort Direction"
      :selectedIndex="directionSelected">
    </CustomSelect>
  </v-container>
</template>
