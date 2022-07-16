<script setup>
import { watch, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '../stores/settings'
const settingsStore = useSettingsStore();
let { settings } = storeToRefs(settingsStore);

let darkMode = ref(settings.value.theme === 'dark' ? true : false);
watch(darkMode, async(newData) => {
  if(newData) {
    settings.value.theme = 'dark';
  } else {
    settings.value.theme = 'light';
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
      <div>Theme: {{ settings.theme }}</div>
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
