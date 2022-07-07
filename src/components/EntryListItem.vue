<script setup>
import { ref, computed } from 'vue'

import { useTreeStore } from '../stores/tree';

const treeStore = useTreeStore();

const props = defineProps({
	node: {
		type: Object,
		required: true
	},
	index: {
		type: Number,
		required: true
	},
});

function getPreviousDay(date = new Date()) {
  const previous = new Date(date.getTime());
  previous.setDate(date.getDate() - 1);

  return previous;
}

function formatDate(dateString) {
  let d = new Date(dateString);
  if (d > getPreviousDay()) {
    let min = String(d.getMinutes()).padStart(2, '0');
    let hours = ("0"+(d.getHours() % 12  || 12)).slice(-2);
    let ampm = d.getHours() >= 12 ? 'PM' : 'AM';
    return `${hours}:${min} ${ampm}`;
  } else {
    return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;
  }
}

function hasIcon(entry) {
  if(entry.feed.icon && entry.feed.icon.icon_id) {
    return true;
     // treeStore.getIconById(feed.icon.icon_id).data
  }
  return false;  
}

function getIcon(entry) {
  if(entry.feed.icon && entry.feed.icon.icon_id) {
    return 'data:' + treeStore.getIconById(entry.feed.icon.icon_id).data;
  }
  return '';  
}

</script>
<template>
	<tr :data-feed-id="node.id"
		aria-selected="false"
		:class="[{unread: node.status === 'unread'}]"
		:tagIndex="props.index == 0 ? '0' : '-1'">
		<td v-if="hasIcon(node)">
			<img class="icon" :src="getIcon(node)" />
		</td>
		<td>{{ node.title }}</td>        
		<td style="width: 0.1%;">
			<span style="white-space: nowrap;">{{ formatDate(node.published_at) }}</span>
		</td>
	</tr>
</template>
<style>
	
</style>
