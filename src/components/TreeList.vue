<script setup>
import { onBeforeMount } from 'vue'
import { useTreeStore } from '../stores/tree'

import TreeNode from "./TreeNode.vue";

const treeStore = useTreeStore();

const props = defineProps({
  expanded: {
    type: Boolean,
    default: false
  }
});

onBeforeMount(() => {
  console.log('Before Mounted');
  treeStore.load();
});

</script>

<template>
  <nav class="tree">
    <ul class="tree-list" role="tree" aria-label="Feeds List">
      <TreeNode v-for="(node, index) in treeStore.treeData"
        :key="node.id" 
        :node="node" 
        :aria-expanded="props.expanded"
        :index="index"></TreeNode>
    </ul>
  </nav>
</template>

<style>
ul[role="tree"] {
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
