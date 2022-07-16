<script setup>
import { watch, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '../stores/settings'
const settingsStore = useSettingsStore();
let { settings } = storeToRefs(settingsStore);

</script>

<template>
  <v-container>
    <div>List</div>
  </v-container>
</template>
