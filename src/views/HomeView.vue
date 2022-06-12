<script setup>
import TheWelcome from '@/components/TheWelcome.vue'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

</script>

<template>
    <!-- <TheWelcome /> -->
    <splitpanes class="default-theme">
      <pane min-size="30">
        <div>1</div>
      </pane>
      <pane min-size="30">
        <div>2</div>
      </pane>
    </splitpanes>
</template>
