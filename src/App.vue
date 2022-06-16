<script setup>
import { RouterView } from 'vue-router'
import { useSettingsStore } from './stores/settings'

const settingsStore = useSettingsStore();

</script>

<template>
  <v-theme-provider :theme="settingsStore.settings.theme" with-background>
    <v-app>
      <RouterView />
    </v-app>
  </v-theme-provider>
</template>
