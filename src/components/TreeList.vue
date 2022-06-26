<script setup>
import { ref, onMounted } from 'vue'
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

const tree = ref()

onMounted(() => {
  tree.value.firstElementChild.setAttribute('tabIndex', '0')
  console.log(tree.value.firstElementChild);
  // tree.value // <div>
})
</script>

<template>
  <nav class="tree">
    <ul class="tree-list" role="tree" aria-label="Feeds List" ref="tree">
      <TreeNode v-for="node in props.treeData" :key="node.id" :node="node" :aria-expanded="props.expanded"></TreeNode>
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
