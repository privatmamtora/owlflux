<script setup>
import { watch, reactive } from 'vue'

let settings = reactive(JSON.parse(localStorage.getItem('settings') || '{}'));

watch(settings, async(newData) => {
  localStorage.setItem('settings', JSON.stringify(newData));
})

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
  </v-container>
</template>