<script setup>
import { ref, watch } from 'vue'
import { useEntriesStore } from '../stores/entries'
import { watchArray } from '@vueuse/core'

import EntryListItem from "../components/EntryListItem.vue";

const entriesStore = useEntriesStore();

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const tbody = ref(null);

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

function getRowById(id) {
  return tbody.value.querySelector(`[data-feed-id="${id}"`);
}

function setFocus(next, curr) {
  if (!curr) {
    let body = next.closest('tbody');
    curr = body.querySelector('[tabindex="0"]');    
  }
  if (curr) {
    curr.tabIndex = -1;
  }
  next.tabIndex = 0;
  next.focus();
}

function selectRow(e) {
  let row = e.target;
  if(row.tagName === "TD") {
    row = row.closest('TR');    
  }

  if(e.ctrlKey) {
    console.log('Ctrl');
  }
  if(e.shiftKey) {
    console.log('Shift');
  }
  let id = row.getAttribute('data-feed-id');
  if (!entriesStore.selectedEntry) {
    // Nothing selected
    console.log('newly selected', entriesStore.selectedEntry);
    entriesStore.selectedEntry = id;
  } else {
    // Row already selected
    if (entriesStore.selectedEntry && entriesStore.selectedEntry.id != id) {
      // New row doesn't match current row
      if (e.ctrlKey) {
        // Add item
        // let { otherSelected } = entriesStore;
        // console.log(unref(otherSelected));
        if (!entriesStore.otherSelected.includes(id)) {
          // New Item
          entriesStore.otherSelected.push(id);
        } else {
          // Remove Item
          entriesStore.otherSelected.splice(entriesStore.otherSelected.indexOf(id), 1);
        }
      } else if (e.shiftKey) {
        // Select between selectedEntry and new row

      } else {
        console.log('newly selected', entriesStore.selectedEntry);
        entriesStore.selectedEntry = id;
        if (entriesStore.otherSelected.length) {
          entriesStore.otherSelected = [];
        }
      }
    }
  }
}

function setFocusToFirstItem(node) {
  let next = node.parentElement.firstElementChild;
  if(node != next) {
    setFocus(next, node);
  }
}

function setFocusToNextItem(node) {
  let next = node.nextElementSibling;
  if (next) {
    setFocus(next, node);
  }
}

function setFocusToPreviousItem(node) {
  let next = node.previousElementSibling;
  if (next) {
    setFocus(next, node);
  }
}
      
function setFocusToLastItem(node) {
  let next = node.parentElement.lastElementChild;
  if(node != next) {
    setFocus(next, node);
  }
}

let onFocus = (e) => {
  let node = e.target;
  if (node.tagName !== 'TR') {
    return;
  }
  node.classList.add('focus');
}

let onBlur = (e) => {
  let node = e.target;
  if (node.tagName !== 'TR') {
    return;
  }
  node.classList.remove('focus');
}

let handleKeyEvent = (e) => {
  let node = e.target;
  
  if (e.altKey || e.ctrlKey || e.metaKey || e.shift) {
    return;
  }
  
  switch (e.keyCode) {
    case keyCode.RETURN:
    case keyCode.SPACE:
      selectRow(e);
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

watch(()=> entriesStore.selectedEntry, (newValue, oldValue) => {
  console.log('watch old', oldValue);
  console.log('watch new', newValue);
  if (oldValue) {
    let row = getRowById(oldValue);
    row.setAttribute('aria-selected', 'false');
  }
  if (newValue) {
    let row = getRowById(newValue);
    row.setAttribute('aria-selected', 'true');
    setFocus(row);
  }
});

watchArray(()=> entriesStore.otherSelected, (newList, oldList, added, removed) => {
  console.log(added) // [4]
  if (added.length) {
    for (const id of added) {
      let row = getRowById(id);
      row.setAttribute('aria-selected', 'true');
    }
  }
  console.log(removed) // []
  if (removed.length) {
    for (const id of removed) {
      let row = getRowById(id);
      row.setAttribute('aria-selected', 'false');
    }
  }
}, { deep: true });

</script>

<template>
  <v-table 
    density="compact">
    <tbody ref="tbody"
      @click.stop="selectRow"
      @keydown.stop="handleKeyEvent"
      @focus.capture.stop="onFocus"
      @blur.capture.stop="onBlur">
      <template v-for="(entry, index) in props.data.entries" :key="entry.id" >
        <EntryListItem :node="entry" :index="index" />
      </template>
    </tbody>
  </v-table>
</template>

<style>
.v-table--density-compact > .v-table__wrapper > table > tbody > tr > th,
.v-table--density-compact > .v-table__wrapper > table > thead > tr > th,
.v-table--density-compact > .v-table__wrapper > table > tfoot > tr > th {
  height: unset;
}

.v-table--density-compact > .v-table__wrapper > table > tbody > tr > td,
.v-table--density-compact > .v-table__wrapper > table > thead > tr > td,
.v-table--density-compact > .v-table__wrapper > table > tfoot > tr > td {
  height: unset;
}

.v-table > .v-table__wrapper > table > tbody > tr > td,
.v-table > .v-table__wrapper > table > tbody > tr > th,
.v-table > .v-table__wrapper > table > thead > tr > td,
.v-table > .v-table__wrapper > table > thead > tr > th,
.v-table > .v-table__wrapper > table > tfoot > tr > td,
.v-table > .v-table__wrapper > table > tfoot > tr > th {
  padding: 0 8px;
}

.v-table .v-table__wrapper > table {
  border-collapse: collapse;
}

.v-table .v-table__wrapper > table > tbody > tr[aria-selected="true"] {
  background: #ccc;
}

.v-table .v-table__wrapper > table > tbody > tr.unread {
  font-weight: bold;
}

.v-table .v-table__wrapper > table > tbody > tr:focus {
  outline: 0;
}

.v-table .v-table__wrapper > table > tbody > tr.focus {
  background-color: #eee;
  border-style: solid;
  border-width: 2px 0px;
  border-color: #005a9c;
}

/* Mouse hover  */
.v-table .v-table__wrapper > table > tbody > tr.hover {
  background-color: #adddff !important;
}

</style>
