<script setup>
import { ref, watch, onBeforeUpdate, onUpdated, onBeforeMount, onMounted } from 'vue'
import { useEntriesStore } from '../stores/entries'
import { watchArray } from '@vueuse/core'
import { useInfiniteScroll } from '@vueuse/core'

import EntryListItem from "../components/EntryListItem.vue";

console.log('Reload Entries List')

const entriesStore = useEntriesStore();

const props = defineProps({
  selectedFeed: {
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

function selectRow(newRow, ctrlKey, shiftKey) {
  console.log('select', newRow, 'ctrl', ctrlKey, 'shift', shiftKey);
  // Update EntriesStore
  let id = newRow.getAttribute('data-feed-id');
  console.log('current selected', entriesStore.selectedEntry);
  if (!entriesStore.selectedEntry) {
    // Nothing selected
    entriesStore.selectedEntry = id;
    console.log('newly selected', entriesStore.selectedEntry);
  } else {
    // Row already selected
    if (entriesStore.selectedEntry != id) {
      // New row doesn't match current row
      if (ctrlKey) {
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
      } else if (shiftKey) {
        // Select between selectedEntry and new row
        shiftSelectRow(newRow);
      } else {
        entriesStore.selectedEntry = id;
        console.log('newly selected', entriesStore.selectedEntry);
        if (entriesStore.otherSelected.length) {
          entriesStore.otherSelected = [];
        }
      }
    } else {
      // Unselect selected entry
      console.log('unselect selected', entriesStore.selectedEntry);
      entriesStore.selectedEntry = '';
    }
  }
}

function shiftSelectRow(row) {
  let selectedRow = getRowById(entriesStore.selectedEntry);
  let startIndex = selectedRow.rowIndex;
  let endIndex = row.rowIndex;
  let range = [];
  if (endIndex > startIndex) {
    // After
    let count = endIndex - startIndex;
    while (count > 0 && selectedRow.nextElementSibling) {
      selectedRow = selectedRow.nextElementSibling;
      range.push(selectedRow.getAttribute('data-feed-id'));
      count--;
    }
  } else {
    // Before
    let count = startIndex - endIndex;
    while (count > 0 && selectedRow.previousElementSibling) {
      selectedRow = selectedRow.previousElementSibling;
      range.push(selectedRow.getAttribute('data-feed-id'));
      count--;
    }
  }
  entriesStore.otherSelected = range;
  console.log('otherSelected', range);
}

function nextElementPage(row, direction) {
  let rowCount = tbody.value.rows.length;
  if (direction === 'down' && row.index+1 === rowCount) return;
  if (direction === 'up' && row.index === 0) return;

  let pageCount = Math.floor(tbody.value.clientHeight/row.clientHeight);
  let index;
  if(direction === 'down') {
    index = row.rowIndex + pageCount;
    if (index > rowCount) {
      index = rowCount-1;
    }
  } else if (direction === 'up') {
    index = row.rowIndex - pageCount;
    if (index < 0) {
      index = 0;
    }
  }
  return tbody.value.rows[index];
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

let handleClick = (e) => {
  if (e.altKey || e.metaKey) {
    return;
  }
  let row = e.target;
  if(row.tagName === "TD") {
    row = row.closest('TR');
  }

  selectRow(row, e.ctrlKey, e.shiftKey);
  setFocus(row);
}

let handleKeyEvent = (e) => {
  console.log('key event', e);
  // if (e.altKey || e.ctrlKey || e.metaKey || e.shift) {
  if (e.altKey || e.metaKey) {
    return;
  }
  let row = e.target;
  let next;
  switch (e.keyCode) {
    case keyCode.RETURN:
    case keyCode.SPACE:
      selectRow(row, e.ctrlKey, e.shiftKey);
      break;
    case keyCode.UP:
      next = row.previousElementSibling;
      if (next) {
        if(e.shiftKey && next) {
          if (!entriesStore.selectedEntry) {
            selectRow(row);
          }
          shiftSelectRow(next);
        }
        setFocus(next, row);
      }
      e.preventDefault();
      break;
    case keyCode.DOWN:
      next = row.nextElementSibling;
      if (next) {
        if(e.shiftKey && next) {
          if (!entriesStore.selectedEntry) {
            selectRow(row);
          }
          shiftSelectRow(next);
        }
        setFocus(next, row);
      }
      e.preventDefault();
      break;
    case keyCode.HOME:
      next = row.parentElement.firstElementChild;
      if(row != next) {
        if(e.shiftKey && next) {
          if (!entriesStore.selectedEntry) {
            selectRow(row);
          }
          shiftSelectRow(next);
        }
        setFocus(next, row);
      }
      break;
    case keyCode.END:
      next = row.parentElement.lastElementChild;
      if(row != next) {
        if(e.shiftKey && next) {
          if (!entriesStore.selectedEntry) {
            selectRow(row);
          }
          shiftSelectRow(next);
        }
        setFocus(next, row);
      }
      break;
    case keyCode.PAGEUP:
      next = nextElementPage(row, 'up');
      if (next) {
        if(e.shiftKey && next) {
          if (!entriesStore.selectedEntry) {
            selectRow(row);
          }
          shiftSelectRow(next);
        }
        setFocus(next, row);
      }
      e.preventDefault();
      break;
    case keyCode.PAGEDOWN:
      next = nextElementPage(row, 'down');
      if (next) {
        if(e.shiftKey && next) {
          if (!entriesStore.selectedEntry) {
            selectRow(row);
          }
          shiftSelectRow(next);
        }
        setFocus(next, row);
      }
      e.preventDefault();
      break;
    default:
      break;
  }
}

let unWatchSelected;
let unWatchOSelected;

useInfiniteScroll(tbody, () => {
 console.log('loading more');
 entriesStore.loadMore();
},{ distance: 10 });

onBeforeMount(() => {
  console.log('Entries: Before Mounted');
  entriesStore.loadMore();
});

onMounted(() => {
  console.log('Entries: Mounted');
})

const selectedWatch = (newValue, oldValue) => {
  console.log('watch old', oldValue);
  console.log('watch new', newValue);
  if (oldValue) {
    let row = getRowById(oldValue);
    row.setAttribute('aria-selected', 'false');
  }
  if (newValue) {
    let row = getRowById(newValue);
    row.setAttribute('aria-selected', 'true');
  }
}

const otherWatch = (newList, oldList, added, removed) => {
  console.log('Other Added', added)
  if (added.length) {
    for (const id of added) {
      let row = getRowById(id);
      row.setAttribute('aria-selected', 'true');
    }
  }
  console.log('Other Added', removed)
  if (removed.length) {
    for (const id of removed) {
      let row = getRowById(id);
      row.setAttribute('aria-selected', 'false');
    }
  }
}

unWatchSelected = watch(()=> entriesStore.selectedEntry, selectedWatch);
unWatchOSelected = watchArray(()=> entriesStore.otherSelected, otherWatch, { deep: true });

onBeforeUpdate(()=> {
  console.log('Entries: Before Updated');
  if(unWatchSelected) {
    unWatchSelected();
  }
  if(unWatchOSelected) {
    unWatchOSelected();
  }
  entriesStore.$reset();
  entriesStore.loadMore();
});

onUpdated(()=> {
  console.log('Entries: Updated');
  unWatchSelected = watch(()=> entriesStore.selectedEntry, selectedWatch);
  unWatchOSelected = watchArray(()=> entriesStore.otherSelected, otherWatch, { deep: true });
});
</script>

<template>
  <v-table 
    density="compact">
    <tbody ref="tbody"
      @click.stop="handleClick"
      @keydown.stop="handleKeyEvent"
      @focus.capture.stop="onFocus"
      @blur.capture.stop="onBlur">
      <template v-for="(entry, index) in entriesStore.entries" :key="entry.id" >
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
    height: 100%;
    box-sizing:border-box;
  }

  .v-table {
    height: 100%;
  }

  .v-table > .v-table__wrapper {
    height: 100%;
  }

  .v-table .v-table__wrapper > table > tbody {
    display: block;
    overflow-y: auto;
    max-height: calc(100vh - 48px);
  }

  .v-table .v-table__wrapper > table > tbody > tr {
    display: table-row;
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
