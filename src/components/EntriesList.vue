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

function selectRow(e) {
  let row = e.target;
  if(row.tagName === "TD") {
    row = row.closest('TR');    
  }

  let id = row.getAttribute('data-feed-id');
  if (!entriesStore.selectedEntry || (entriesStore.selectedEntry && entriesStore.selectedEntry.id != id)) {
    entriesStore.selectedEntry = id;
  }
  console.log(entriesStore.selectedEntry);
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
    }
  }
})

</script>

<template>
  <v-table 
    density="compact"
    @click.stop="selectRow"
    tabIndex="0">
    <tbody ref="tbody">
      <template v-for="entry in props.data.entries" :key="entry.id" >
        <EntryListItem :node="entry" />
      </template>
    </tbody>
  </v-table>
</template>

<style scoped>
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

.v-table .v-table__wrapper > table > tbody > tr:hover {
  background: #bdf;
}

.v-table .v-table__wrapper > table > tbody > tr[aria-selected="true"] {
  background: #ddd;
}

.v-table .v-table__wrapper > table > tbody > tr {
  font-weight: bold;
}
</style>
