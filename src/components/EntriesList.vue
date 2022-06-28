<script setup>
import { useTreeStore } from '../stores/tree'
const treeStore = useTreeStore();

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

console.log('Setup');

function getPreviousDay(date = new Date()) {
  const previous = new Date(date.getTime());
  previous.setDate(date.getDate() - 1);

  return previous;
}

function formatDate(dateString) {
  let d = new Date(dateString);
  let min = String(d.getMinutes()).padStart(2, '0');
  let hours = ("0"+(d.getHours() % 12  || 12)).slice(-2);
  let ampm = d.getHours() >= 12 ? 'PM' : 'AM';

  if (d > getPreviousDay()) {
    return `${hours}:${min} ${ampm}`;
  } else {
    return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()} ${hours}:${min} ${ampm}`;
  }
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
  console.log(e.target);
  let row = e.target;
  if(row.tagName === "TD") {
    row = row.closest('TR');    
  }
  toggleRow(row);
}

</script>

<template>
  <v-table 
    density="compact"    
    @click.stop="selectRow">
    <tbody>
      <tr v-for="entry in props.data.entries"
        :key="entry.id" 
        :data-feed-id="entry.id"
        aria-selected="false">
        <td>{{ entry.title }}</td>        
        <td>{{ formatDate(entry.published_at) }}</td>        
      </tr>
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

.v-table .v-table__wrapper > table > tbody > tr:hover {
  background: #bdf;
}

.v-table .v-table__wrapper > table > tbody > tr[aria-selected="true"] {
  background: #ddd;
}
/*tr[aria-selected="true"] {
  background: #bdf;
}*/

</style>
