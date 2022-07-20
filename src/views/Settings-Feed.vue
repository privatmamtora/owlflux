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

let statusSelected = 0;
if (settingsStore.settings['status'] && settingsStore.settings['status'].length) {
  statusSelected = MinifluxApi.statusOptions.findIndex(o => JSON.stringify(o.value) === JSON.stringify(settingsStore.settings['status']));
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

function statusUpdated(index) {
  let newValue = MinifluxApi.statusOptions[index].value;
  if (JSON.stringify(settingsStore.settings['status']) !== JSON.stringify(newValue)) {
    settingsStore.settings['status'] = newValue;
  }
}

</script>

<template>
  <v-container>
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
    <CustomSelect
      :options="MinifluxApi.statusOptions.map(o => o.name)"
      @update:selected="statusUpdated"
      label="Entries Visible"
      :selectedIndex="statusSelected">
    </CustomSelect>
  </v-container>
</template>
