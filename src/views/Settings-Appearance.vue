<script setup>
import { watch, ref } from 'vue'
import { useSettingsStore } from '../stores/settings'
const settingsStore = useSettingsStore();

let darkMode = ref(settingsStore.settings.theme === 'dark' ? true : false);
watch(darkMode, async(newData) => {
  if(newData) {
    settingsStore.settings.theme = 'dark';
  } else {
    settingsStore.settings.theme = 'light';
  }
})

</script>

<template>
  <v-container dark>
    <v-switch 
      label="Dark Mode"
      inset 
      v-model="darkMode"></v-switch>
    <v-container>
      <div>Dark Mode: {{ darkMode }}</div>
      <div>Theme: {{ settingsStore.settings.theme }}</div>
      <v-sheet color="background">Background</v-sheet>
      <v-sheet color="error">Error</v-sheet>
      <v-sheet color="info">Info</v-sheet>
      <v-sheet color="on-surface-variant">On Surface Variant</v-sheet>
      <v-sheet color="primary">Primary</v-sheet>
      <v-sheet color="primary-darken-1">Primary Darken 1</v-sheet>
      <v-sheet color="secondary">Secondary</v-sheet>
      <v-sheet color="secondary-darken-1">Secondary Darken 1</v-sheet>
      <v-sheet color="success">Success</v-sheet>
      <v-sheet color="success-darken-1">Success Darken 1</v-sheet>
      <v-sheet color="surface">Surface</v-sheet>
      <v-sheet color="surface-variant">Surface Variant</v-sheet>
      <v-sheet color="warning">Warning</v-sheet>
    </v-container>
  </v-container>
</template>
