<script setup>
import { onBeforeMount } from 'vue'
import { useTreeStore } from '../stores/tree'

import TreeNode from "./TreeNode.vue";

const treeStore = useTreeStore();

const props = defineProps({
  expanded: {
    type: Boolean,
    default: true
  }
});

console.log('Reload Tree');

onBeforeMount(() => {
  console.log('Tree: Before Mounted');
  treeStore.load();
});

</script>

<template>
  <v-card>
    <nav class="tree">
      <ul class="tree-list" role="tree" aria-label="Feeds List">
        <TreeNode v-for="(node, index) in treeStore.treeData"
          :key="node.id"
          :node="node"
          :aria-expanded="props.expanded"
          :index="index"></TreeNode>
      </ul>
    </nav>
  </v-card>
</template>

<style>
  nav {
    margin: 0;
    padding: 6px;
  }

  nav.focus {
    border: 3px solid #005a9c;
  }

  ul[role="tree"] {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  ul[role="tree"] li {
    margin: 0;
    padding: 0;
    list-style: none;
    width: auto;
  }

  [role="treeitem"] > span.item {
    display: flex;
    align-items: center;
  }

  [role="treeitem"] > span.item img {
    height: 1.1em;
    padding-right: 2px;
  }

  /* disable default keyboard focus styling for treeitems
     Keyboard focus is styled with the following CSS */
  [role="treeitem"]:focus {
    outline: 0;
  }

  /* SHow/Hide Sub-items */
  [role="treeitem"][aria-expanded="false"] + [role="group"] {
    display: none;
  }

  [role="treeitem"][aria-expanded="true"] + [role="group"] {
    display: block;
  }

  [role="treeitem"][aria-expanded="false"] > ul {
    display: none;
  }

  [role="treeitem"][aria-expanded="true"] > ul {
    display: block;
  }

  /* Keyboard focus  */
  [role="treeitem"].focus > span.item {
    background-color: #eee;
    border: 2px #005a9c solid;
  }

  /* Selected Item  */
  [role="treeitem"][aria-selected="true"] > span.item {
    background-color: #ccc;
    border-left: 5px solid #005a9c;
    padding-left: 4px;
  }

  /* Mouse hover  */
  [role="treeitem"].hover > span.item {
    padding-left: 4px;
    background-color: #adddff;
    /*background-color: #ddd;*/
    border-left: 5px solid #333;
  }
</style>
