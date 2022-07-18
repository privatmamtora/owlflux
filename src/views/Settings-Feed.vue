<script setup>
import { useSettingsStore } from '../stores/settings'

import CustomSelect from "../components/CustomSelect.vue";

import { MinifluxApi } from '../util/miniflux';

const settingsStore = useSettingsStore();

let selected = 0;
if (settingsStore.settings['orderBy']) {
  selected = MinifluxApi.orderOptions.findIndex(o => o.value === settingsStore.settings['orderBy']);
}

function updated(index) {
  let newOrder = MinifluxApi.orderOptions[index].value;
  if (settingsStore.settings['orderBy'] !== newOrder) {
    settingsStore.settings['orderBy'] = newOrder;
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
      @update:selected="updated"
      label="Sort Order"
      :selectedIndex="selected">
    </CustomSelect>
  </v-container>
</template>
