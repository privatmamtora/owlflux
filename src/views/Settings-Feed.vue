<script setup>
import { watch, reactive, ref } from 'vue'

import { storeToRefs } from 'pinia'
import { useSettingsStore } from '../stores/settings'

import CustomSelect from "../components/CustomSelect.vue";

import { MinifluxApi } from '../util/miniflux';

const settingsStore = useSettingsStore();
let { settings } = storeToRefs(settingsStore);

console.log(MinifluxApi.orderOptions[0]);

function updated(index) {
  console.log(index);
  console.log(MinifluxApi.orderOptions[index]);
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
      :selectedIndex="3">
    </CustomSelect>
  </v-container>
</template>
