<script setup>
import { useSettingsStore } from '../stores/settings'
const settingsStore = useSettingsStore();
</script>

<template>
  <v-container>
    <v-text-field 
      label="Host"
      variant="outlined"
      shaped 
      v-model="settingsStore.settings.host"></v-text-field>
    <v-text-field 
      label="API Key" 
      variant="outlined"
      shaped
      v-model="settingsStore.settings.key"></v-text-field>
    <v-container>
      <div>{{ settingsStore.settings.host }}</div>
      <div>{{ settingsStore.settings.key }}</div>
    </v-container>
  </v-container>
</template>
