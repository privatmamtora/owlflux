<script setup>
import { ref, watch } from 'vue'

const host = ref('');
const key = ref('');
host.value = JSON.parse(localStorage.getItem('host'))
key.value = JSON.parse(localStorage.getItem('key'))

watch(host, async (newHost) => {
  localStorage.setItem('host', JSON.stringify(newHost));
})

watch(key, async (newKey) => {
  localStorage.setItem('key', JSON.stringify(newKey));
})
</script>

<template>
  <v-container>
    <v-text-field 
      label="Host"
      variant="outlined"
      shaped 
      v-model="host"></v-text-field>
    <v-text-field 
      label="API Key" 
      variant="outlined"
      shaped
      v-model="key"></v-text-field>
  </v-container>
</template>