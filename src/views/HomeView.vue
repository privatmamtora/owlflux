<script setup>
import TheWelcome from '@/components/TheWelcome.vue'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

const items = [
      {
        title: 'Foo',
        value: 'foo',
      },
      {
        title: 'Bar',
        value: 'bar',
      },
      {
        title: 'Fizz',
        value: 'fizz',
      },
      {
        title: 'Buzz',
        value: 'buzz',
      }
];

</script>

<script>
  export default {
    data: () => ({
      drawer: false,
      group: null,
    }),

    watch: {
      group () {
        this.drawer = false
      },
    },
  }
</script>

<template>
    <!-- <TheWelcome /> -->
    <v-navigation-drawer v-model="drawer" app>
      <v-list-item>
        <v-list-item-title>OwlFlux</v-list-item-title>
        <v-btn class="ml-auto" to="/settings">
        <v-list-item-icon class="ml-auto">mdi-cog</v-list-item-icon>
      </v-btn>
      </v-list-item>
      <v-list
        :items="items"
      ></v-list>
    </v-navigation-drawer>
    <v-app-bar density="compact">      
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>My files</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <Splitpanes class="default-theme">
        <Pane min-size="30">
          <div>1</div>
        </Pane>
        <Pane min-size="30">
          <div>2</div>
        </Pane>
      </Splitpanes>
  </v-main>
</template>
