<script setup>
import { ref } from 'vue'
import { useEntriesStore } from '../stores/entries'

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

function hasSelected(table) {
  return getSelected(table).length;
}

function getSelected(table) {
  if (table.tagName !== 'TABLE') {
    table = table.closest('TABLE');
  }
  return table.querySelectorAll('[aria-selected="true"]');
}

function isSelected(row) {
  return row.getAttribute('aria-selected') === 'true';
}

function toggleRow(row) {
  if (isSelected(row)) {
    row.setAttribute('aria-selected', 'false');
  } else {
    row.setAttribute('aria-selected', 'true');
  }
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
    // ulItem.removeChild(this);
  }
  if(e.shiftKey) {
    // 
  }
  let id = row.getAttribute('data-feed-id');
  if (!entriesStore.selectedEntry || (entriesStore.selectedEntry && entriesStore.selectedEntry.id != id)) {
    console.log('newly selected', entriesStore.selectedEntry);
    entriesStore.selectedEntry = id;
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
  console.log('focus', node);
  if (node.tagName !== 'TR') {
    return;
  }
  node.classList.add('focus');
}

let onBlur = (e) => {
  let node = e.target;
  console.log('blur', node);
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

entriesStore.$subscribe((mutation, state) => {
  console.log('mutation',mutation, 'state', state);
  if (mutation.type == 'direct' && mutation.events.key === 'selectedEntry') {
    if (mutation.events.oldValue) {
      let row = getRowById(mutation.events.oldValue);
      row.setAttribute('aria-selected', 'false');
    }
    if (mutation.events.newValue) {      
      let row = getRowById(mutation.events.newValue);
      row.setAttribute('aria-selected', 'true');
      setFocus(row);
    }
  }
})

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
