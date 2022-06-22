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
  let node = e.target;
  console.log(node);
  if (node.tagName !== 'LI') {
    node = node.closest('LI');
  }
  if(treeStore.selectedItem !== node) {
    if(treeStore.selectedItem) {
      treeStore.selectedItem.setAttribute('aria-selected', 'false');
    }
    node.setAttribute('aria-selected', 'true');      
    treeStore.selectedItem = node;
  }
}

let handleKeyEvent = (e) => {
  console.log(e);
  
  if (e.altKey || e.ctrlKey || e.metaKey || e.shift) {
    return;
  }

  switch (e.keyCode) {
    case this.keyCode.RETURN:
    case this.keyCode.SPACE:
      selectNode(e);
      break;      
    default:
      break;
  }
}

let hover = ref(false);

</script>

<template>
  <li 
    class="node-tree" 
    role="treeitem" 
    :aria-expanded="hasChildren && showChildren"    
    aria-selected="false"
    @keypress.stop="handleKeyEvent"
    @click.stop="selectNode"
    @mouseover.stop="hover = true"
    @mouseout.stop="hover = false"
    :class="{ 'hover': hover }" >
    <span class="item">
      <v-icon
        v-if="hasChildren"
        @click.stop="toggleChildren"
      >{{currentIcon}}</v-icon>
      <span class="label">{{ node.label }}</span>
  </span>
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
[role="treeitem"] {
  width: auto;
}

/* disable default keyboard focus styling for treeitems
   Keyboard focus is styled with the following CSS */
[role="treeitem"]:focus {
  outline: 0;
}


/*[role="treeitem"]:focus,
[role="treeitem"] span:focus {
  border-color: black;
  background-color: #eee;
}*/

/*[role="treeitem"]:hover {
  padding-left: 4px;
  background-color: #ddd;
  border-left: 5px solid #333;
}*/

ul, ol {
    margin-left: 0;
    padding-left: 1em;
  }

ul[role="tree"] {
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 120%;
}

ul[role="tree"] li {
  margin: 0;
  padding: 0;
  list-style: none;
}

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

[role="treeitem"],
[role="treeitem"] span {
  margin: 0;
  padding: 0.125em;
}

/* disable default keyboard focus styling for treeitems
   Keyboard focus is styled with the following CSS */
[role="treeitem"]:focus {
  outline: 0;
}

[role="treeitem"].focus,
[role="treeitem"] span.focus {
  border-color: black;
  background-color: #eee;
}

[role="treeitem"].hover > span.item span.label{
  padding-left: 4px;
  background-color: #adddff;
  /*background-color: #ddd;*/
  border-left: 5px solid #333;
}

[role="treeitem"][aria-selected="true"] > span.item span.label {
  border-left: 5px solid #005a9c;
  padding-left: 4px;
  background-color: #ddd;
}


</style>