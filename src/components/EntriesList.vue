<script setup>
import { useEntriesStore } from '../stores/entries'

import EntryListItem from "../components/EntryListItem.vue";

const entriesStore = useEntriesStore();

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

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

  
  if (hasSelected(row)) {
    toggleRow(getSelected(row)[0]);
    toggleRow(row);
  } else {
    toggleRow(row);
  }
  let id = row.getAttribute('data-feed-id');
  entriesStore.selectedEntry = [props.data.entries.find(ent => ent.id == id)];
  console.log(entriesStore.selectedEntry);
}

</script>

<template>
  <v-table 
    density="compact"    
    @click.stop="selectRow"
    tabIndex="0">
    <tbody>
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
