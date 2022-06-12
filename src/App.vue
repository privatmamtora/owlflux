<script setup>
import { RouterLink, RouterView } from 'vue-router'

// let drawer = false;
// let group = null;

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

// watch(group, async ()=> {this.drawer = false})

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
  <v-app>
    <v-app-bar color="primary" density="compact">      
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>My files</v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" color="grey-darken-2" app>
      <v-list
        :items="items"
      ></v-list>
    </v-navigation-drawer>
    
    <!-- <header>
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

      <div class="wrapper">
        <HelloWorld msg="You did it also!" />

        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/settings">About</RouterLink>
        </nav>
      </div>
    </header> -->
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>
