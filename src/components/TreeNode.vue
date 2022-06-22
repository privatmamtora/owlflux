<script setup>
import { ref, computed } from 'vue'
import { useTreeStore } from '../stores/tree'
const treeStore = useTreeStore();

const props = defineProps({
  node: {
    type: Object,
    required: true
  },
  spacing: {
    type: Number,
    default: 0
  },
  ariaExpanded: {
    type: Boolean,
    default: true
  }
});

let showChildren = ref(props.ariaExpanded);
let currentIcon = ref('');
showChildren.value ? currentIcon.value = 'mdi-chevron-down' : currentIcon.value = 'mdi-chevron-right';

let toggleChildren = (e) => { 
  showChildren.value = !showChildren.value;
  showChildren.value ? currentIcon.value = 'mdi-chevron-down' : currentIcon.value = 'mdi-chevron-right'
  // e.stopPropagation()
}

const nodeMargin = computed(() => {
  return {'margin-left': `${props.spacing}px`}
});

const hasChildren = computed(() => {
  const { children } = props.node
  return children && children.length > 0
});

let selectNode = (e) => {
  console.log(e);
  if(treeStore.selectedItem !== e.target) {
    if(treeStore.selectedItem) {
      treeStore.selectedItem.setAttribute('aria-selected', 'false');
    }
    e.target.setAttribute('aria-selected', 'true');      
    treeStore.selectedItem = e.target;
  }
}

</script>

<template>
  <li 
    class="node-tree" 
    role="treeitem" 
    :aria-expanded="hasChildren && showChildren" 
    aria-selected="false">
    <v-icon
      v-if="hasChildren"
      @click.stop="toggleChildren"
      @keypress.stop="toggleChildren"
    >{{currentIcon}}</v-icon>
    <span class="label">{{ node.label }}</span>
    <ul role="group" v-if="hasChildren" v-show="showChildren" :style="nodeMargin">
      <TreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :spacing="spacing + 10"
      />
    </ul>
  </li>
</template>

<style>
ul[role="tree"] li {
  margin: 0;
  padding: 0;
  list-style: none;
  width:  auto;
}

[role="treeitem"][aria-expanded="false"] + [role="group"] {
  display: none;
}

[role="treeitem"][aria-expanded="true"] + [role="group"] {
  display: block;
}

[role="treeitem"].doc::before {
  content: "\f15c";
  display: inline-block;
  padding-right: 2px;
  padding-left: 5px;
  vertical-align: middle;
}

[role="treeitem"][aria-expanded="false"] > ul {
  display: none;
}

[role="treeitem"][aria-expanded="true"] > ul {
  display: block;
}

[role="treeitem"],
[role="treeitem"] span {
  width: 9em;
  margin: 0;
  padding: 0.125em;
  /*display: block;*/
}

[role="treeitem"] span {
  pointer-events: none;
}

/* disable default keyboard focus styling for treeitems
   Keyboard focus is styled with the following CSS */
[role="treeitem"]:focus {
  outline: 0;
}

[role="treeitem"][aria-selected="true"] {
  padding-left: 4px;
  border-left: 5px solid #005a9c;
}

/*[role="treeitem"]:focus,
[role="treeitem"] span:focus {
  border-color: black;
  background-color: #eee;
}*/

[role="treeitem"]:hover {
  padding-left: 4px;
  background-color: #ddd;
  border-left: 5px solid #333;
}

</style>