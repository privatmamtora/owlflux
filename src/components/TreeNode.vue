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

const keyCode = Object.freeze({
  RETURN: 13,
  SPACE: 32,
  PAGEUP: 33,
  PAGEDOWN: 34,
  END: 35,
  HOME: 36,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
});

let showChildren = ref(props.ariaExpanded);
let currentIcon = ref('');
showChildren.value ? currentIcon.value = 'mdi-chevron-down' : currentIcon.value = 'mdi-chevron-right';

let toggleChildren = () => { 
  showChildren.value = !showChildren.value;
  showChildren.value ? currentIcon.value = 'mdi-chevron-down' : currentIcon.value = 'mdi-chevron-right'
  // e.stopPropagation()
}

const nodePadding = computed(() => {
  return {'padding-left': `${props.spacing*1.25}em`}
});

const hasChildren = computed(() => {
  const { children } = props.node
  return children && children.length > 0
});

let selectNode = (e) => {
  let node = e.target;
  if (node.tagName !== 'LI') {
    node = node.closest('LI');
  }
  if(treeStore.selectedItem !== node) {
    if(treeStore.selectedItem) {
      treeStore.selectedItem.setAttribute('aria-selected', 'false');
    }
    node.setAttribute('aria-selected', 'true');      
    treeStore.selectedItem = node;
    treeStore.selectedItemData = props.node;
  }
}

function setFocus(curr, next) {
  curr.tabIndex = -1;
  next.tabIndex = 0;
  next.focus();
}

function setFocusToFirstItem(node) {
  let nodes = Array.from(node.closest('nav').querySelectorAll('LI[role="treeitem"]'));
  let index = 0;
  let next;

  while (index < nodes.length) {
    if(nodes[index].clientWidth) {
      next = nodes[index];
      break;
    }
    index++;
  }
  
  if (next) {
    setFocus(node, next);
  }
}

function setFocusToNextItem(node) {
  let nodes = Array.from(node.closest('nav').querySelectorAll('LI[role="treeitem"]'));
  let index = nodes.indexOf(node)+1;
  let next;

  while (index < nodes.length) {
    if(nodes[index].clientWidth) {
      next = nodes[index];
      break;
    }
    index++;
  }
  
  if (next) {
    setFocus(node, next);
  }
}

function setFocusToPreviousItem(node) {
  let nodes = Array.from(node.closest('nav').querySelectorAll('LI[role="treeitem"]'));
  let index = nodes.indexOf(node)-1;
  let next;

  while (index > -1) {
    if(nodes[index].clientWidth) {
      next = nodes[index];
      break;
    }
    index--;
  }
  
  if (next) {
    setFocus(node, next);
  }
}

function setFocusToLastItem(node) {
  let nodes = Array.from(node.closest('nav').querySelectorAll('LI[role="treeitem"]'));
  let index = nodes.length-1;
  let next;

  while (index > -1) {
    if(nodes[index].clientWidth) {
      next = nodes[index];
      break;
    }
    index--;
  }
  
  if (next) {
    setFocus(node, next);
  }
}

let handleKeyEvent = (e) => {
  let node = e.target;
  
  if (e.altKey || e.ctrlKey || e.metaKey || e.shift) {
    return;
  }
  
  switch (e.keyCode) {
    case keyCode.RETURN:
    case keyCode.SPACE:
      selectNode(e);
      break;

    case keyCode.RIGHT:
      if (hasChildren.value && !showChildren.value) {
        toggleChildren(e);
      }
      break;
    case keyCode.LEFT:
      if (hasChildren.value && showChildren.value) {
        toggleChildren(e);
      } else {
        if (node.parentElement.closest('LI')) {
          setFocus(node, node.parentElement.closest('LI'));
        }
      }
      break;
    case keyCode.UP:
      setFocusToPreviousItem(node);
      break;
    case keyCode.DOWN:
      setFocusToNextItem(node);
      break;
    case keyCode.HOME:
      setFocusToFirstItem(node);
      break;
    case keyCode.END:
      setFocusToLastItem(node);
      break;
    default:
      break;
  }
}

let hover = ref(false);

const index = computed(() => {
  if (props.node.id == -1) {
    return '0';
  }
  return '-1';
});

let onFocus = (e) => {
  let node = e.target;
  if (node.tagName !== 'LI') {
    return;
  }
  node.classList.add('focus');
  node.closest('NAV').classList.add('focus');
}

let onBlur = (e) => {
  let node = e.target;
  if (node.tagName !== 'LI') {
    return;
  }
  node.classList.remove('focus');
  node.closest('NAV').classList.remove('focus');
}

const hasIcon = computed(() => {
  if(props.node.type === 'feed' && props.node.icon.data) {
    return true;
  }
  return false;  
});

const unreadCount = computed(() => {
  if(props.node.type === 'feed') {
    return treeStore.unreadCounters[props.node.id];
  } else if (props.node.type === 'category') {
    return props.node.children.reduce((previousValue, currentValue) => { 
      return previousValue + treeStore.unreadCounters[currentValue.id];
    }, 0);
  } else if (props.node.id === -1) {
    return Object.keys(treeStore.unreadCounters).reduce((previousValue, currentValue) => { 
      return previousValue + treeStore.unreadCounters[currentValue];
    }, 0);
  }
  return 0;
});

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
    :abIndex="index" >
    <span class="item"
    :style="nodePadding" >
      <v-icon
        v-if="hasChildren"
        size="small"
        @click.stop="toggleChildren"
      >{{currentIcon}}</v-icon>      
      <img v-if="hasIcon" style="height: 1em; max-width: 100%;" :src="node.icon.data" />
      <span class="label">{{ node.title }}</span>
      <v-badge 
      v-if="unreadCount"
      color="info"
      :content="unreadCount" 
      inline></v-badge>
    </span>
    <ul role="group" 
      v-if="hasChildren" 
      v-show="showChildren">
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