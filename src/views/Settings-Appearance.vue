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
  </v-container>
  <v-container>
    <div>Dark Mode: {{ darkMode }}</div>
    <div>Theme: {{ settings.theme }}</div>
    <v-card color="primary">Primary</v-card>
    <v-card color="primary-darken-1">Primary Darken 1</v-card>
    <v-card color="secondary">Secondary</v-card>
    <v-card color="secondary-darken-1">Secondary Darken 1</v-card>
    <v-card color="surface">Surface</v-card>
    <v-card color="background">Background</v-card>
    <v-card color="info">Info</v-card>
    <v-card color="success">Success</v-card>
    <v-card color="success-darken-1">Success Darken 1</v-card>
    <v-card color="error">Error</v-card>
    <v-card color="warning">Warning</v-card>
  </v-container>
</template>