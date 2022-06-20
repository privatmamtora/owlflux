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
  <div class="tree">
    <ul class="tree-list" role="tree" aria-label="Feeds List">
      <TreeNode v-for="node in props.treeData" :key="node.id" :node="node"></TreeNode>
    </ul>
  </div>
</template>

<style>
.tree-list ul {
  padding-left: 16px;
  margin: 6px 0;
}
</style>
