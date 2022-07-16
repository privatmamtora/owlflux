<script setup>
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '../stores/settings'

const settingsStore = useSettingsStore();
let { settings } = storeToRefs(settingsStore);

</script>

<template>
  <v-container>
    <v-text-field 
      label="Host"
      variant="outlined"
      shaped 
      v-model="settings.host"></v-text-field>
    <v-text-field 
      label="API Key" 
      variant="outlined"
      shaped
      v-model="settings.key"></v-text-field>
    <v-container>
      <div>{{settings.host}}</div>
      <div>{{settings.key}}</div>
    </v-container>
  </v-container>
</template>
