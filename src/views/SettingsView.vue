<script setup>
import { RouterView, useRouter } from 'vue-router'

const router = useRouter();
let children = router.currentRoute.value.matched.find((r) => r.children && r.children.length).children.sort((a,b) => a.meta.tabIndex - b.meta.tabIndex);
let routes = router.getRoutes();

let tabs = [];
for(const child of children) {
  let path = routes.find((r) => r.name === child.name).path;
  tabs.push({ id: child.meta.tabIndex, name: child.meta.tabName, route: path });
}

</script>

<template>
  <v-app-bar density="compact">
    <v-btn icon to="/">      
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <v-toolbar-title>Settings</v-toolbar-title>
  </v-app-bar>
  <v-main>
    <v-tabs grow density="compact">
      <v-tab v-for="tab of tabs" :key="tab.id" :to="tab.route">{{ tab.name}}</v-tab>
    </v-tabs>
    <!-- <RouterView /> -->
    <RouterView v-slot="{ Component, route }">
      <!-- Use any custom transition and fallback to `fade` -->
      <transition mode="out-in" :name="route.meta.transitionName" type="animation">
        <component :is="Component" />
      </transition>
    </RouterView>

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

.v-tabs--horizontal .v-btn.v-btn--density-default {
  height: var(--v-btn-height);
}

.slide-left-leave-active {
  animation-name: slideOutRight;
  animation-duration: 0.25s;
  animation-timing-function: linear;
}
.slide-left-enter-active {
  animation-name: slideInLeft;
  animation-duration: 0.15s;
  animation-timing-function: linear;
}

.slide-right-leave-active {
  animation-name: slideOutLeft;
  animation-duration: 0.25s;
  animation-timing-function: linear;
}
.slide-right-enter-active {
  animation-name: slideInRight;
  animation-duration: 0.15s;
  animation-timing-function: linear;
}

@keyframes slideInLeft {
  from {
    transform: translate3d(-100%, 0, 0);
    visibility: visible;
  }

  to {
    transform: translate3d(0, 0, 0);
  }
}
@keyframes slideInRight {
  from {
    transform: translate3d(100%, 0, 0);
    visibility: visible;
  }

  to {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes slideOutLeft {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    visibility: hidden;
    transform: translate3d(-100%, 0, 0);
  }
}
@keyframes slideOutRight {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    visibility: hidden;
    transform: translate3d(100%, 0, 0);
  }
}
</style>
