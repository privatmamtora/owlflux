<script setup>
import { onBeforeUpdate, onUpdated, onBeforeMount, onMounted } from 'vue'
import { useEntriesStore } from '../stores/entries'

console.log('Load Entry');

const entriesStore = useEntriesStore();

const props = defineProps({
  selectedEntry: {
    type: Object,
    required: true
  }
});

onBeforeMount(() => {
  console.log('Entry Content: Before Mounted');
});

onMounted(() => {
  console.log('Entry Content: Mounted');
})

onBeforeUpdate(()=> {
  console.log('Entry Content: Before Updated');
});

onUpdated(()=> {
  console.log('Entry Content: Updated');
});
</script>

<template>
  <v-sheet v-html="props.selectedEntry.content"></v-sheet>
</template>

<style>

</style>
