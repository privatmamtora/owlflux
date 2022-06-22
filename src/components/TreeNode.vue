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

const nodePadding = computed(() => {
  return {'padding-left': `${props.spacing*1.5}em`}
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

const index = computed(() => {
  if (treeStore.first) {
    treeStore.first = false;
    return '0';
  } else {
    return '-1'
  }
});

let onFocus = (e) => {
  let node = e.target;
  console.log('focus', node);
  if (node.tagName !== 'LI') {
    return;
  }
  node.classList.add('focus');
  node.closest('NAV').classList.add('focus');
}

let onBlur = (e) => {
  let node = e.target;
  console.log('blur', node);
  if (node.tagName !== 'LI') {
    return;
  }
  node.classList.remove('focus');
  node.closest('NAV').classList.remove('focus');
}

</script>

<template>
  <li role="treeitem" 
    aria-selected="false"
    :aria-expanded="hasChildren && showChildren"    
    @keydown.stop="handleKeyEvent"
    @click.stop="selectNode"
    @focus.stop="onFocus"
    @blur.stop="onBlur"
    @mouseover.stop="hover = true"
    @mouseout.stop="hover = false"
    :class="{ 'hover': hover }"
    :tabIndex="index" >
    <span class="item"
    :style="nodePadding" >
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
        :spacing="props.spacing + 1"
      />
    </ul>
  </li>
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
  font-size: 120%;
}

ul[role="tree"] li {
  margin: 0;
  padding: 0;
  list-style: none;
  width: auto;
}

[role="treeitem"] > span.item {
  display: flex;
}

/* disable default keyboard focus styling for treeitems
   Keyboard focus is styled with the following CSS */
[role="treeitem"]:focus {
  outline: 0;
}

/* Handle indent */
/*ul[role="group"] > li span.item, ol[role="group"] > li span.item {
  margin-left: 0;
  padding-left: 1em;
}*/

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
  border-color: black;
  background-color: #eee;
  border: 2px #005a9c solid;
}

/* Selected Item  */
[role="treeitem"][aria-selected="true"] > span.item {
  background-color: #ddd;
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