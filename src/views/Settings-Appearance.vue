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
</template>