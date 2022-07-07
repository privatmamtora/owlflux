<script setup>
import TreeNode from "./TreeNode.vue";

const props = defineProps({
  treeData: {
    type: Object,
    required: true
  },
  expanded: {
    type: Boolean,
    default: false
  }
});

</script>

<template>
  <nav class="tree">
    <ul class="tree-list" role="tree" aria-label="Feeds List">
      <TreeNode v-for="(node, index) in props.treeData" 
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
