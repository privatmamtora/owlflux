<script setup>
import { watch, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '../stores/theme'
const themeStore = useThemeStore();
let { themeColor } = storeToRefs(themeStore);

let darkMode = ref(themeColor.value === 'dark' ? true : false);
watch(darkMode, async(newData) => {
  if(newData) {
    themeColor.value = 'dark';
  } else {
    themeColor.value = 'light';
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