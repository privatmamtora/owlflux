<script setup>
import { RouterView } from 'vue-router'
import { useThemeStore } from './stores/theme'

const themeStore = useThemeStore();
</script>

<template>
  <v-theme-provider :theme="themeStore.themeColor" with-background>
    <v-app>
      <RouterView />
    </v-app>
</v-theme-provider>
</template>
