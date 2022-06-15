<script setup>
import { RouterLink, RouterView } from 'vue-router'

const tabs = [
        { id: 1, name: "Core", route: `/settings` },
        { id: 2, name: "Appearance", route: `/settings/appearance` }
      ]

</script>

<template>
  <v-app-bar density="compact">  
    <v-btn icon to="/">      
    <v-icon>mdi-arrow-left</v-icon>
  </v-btn>
    <v-toolbar-title>Settings</v-toolbar-title>
    </v-app-bar>
  <v-main>
    <v-tabs grow>
      <v-tab v-for="tab of tabs" :key="tab.id" :to="tab.route">{{ tab.name}}</v-tab>
    </v-tabs>
    <RouterView/>
  </v-main>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
