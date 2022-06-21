<script setup>
import TreeNode from "./TreeNode.vue";

const props = defineProps({
  treeData: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <nav class="tree">
    <ul class="tree-list" role="tree" aria-label="Feeds List">
      <TreeNode v-for="node in props.treeData" :key="node.id" :node="node"></TreeNode>
    </ul>
  </nav>
</template>

<style>
ul[role="tree"] {
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 120%;
}
</style>
