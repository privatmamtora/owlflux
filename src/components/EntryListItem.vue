<script setup>
import { ref, computed } from 'vue';

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

function mouseOver(e) {
	let node = e.target;	
	if (node.tagName !== 'TR') {
    node = node.closest('TR');
  }
	if (!node.classList.contains('hover')) {
		node.classList.add('hover');
	}
}

function mouseOut(e) {
	let node = e.target;	
	if (node.tagName !== 'TR') {
    node = node.closest('TR');
  }
	if (node.classList.contains('hover')) {
		node.classList.remove('hover');
	}
}

let status = '';
if (props.node.status === 'unread') {
	status = 'unread';
}

</script>
<template>
	<tr :data-feed-id="node.id"
		aria-selected="false"
		:class="status"
		:tabIndex="props.index == 0 ? '0' : '-1'"
    @focus.capture.stop="onFocus"
    @blur.capture.stop="onBlur"
    @mouseover.stop="mouseOver"
    @mouseout.stop="mouseOut">
		<td class="icon"
			v-if="hasIcon(node)">
			<img class="icon" :src="getIcon(node)" />
		</td>
		<td>{{ node.title }}</td>
		<td style="width: 0.1%;">
			<span style="white-space: nowrap;">{{ formatDate(node.published_at) }}</span>
		</td>
	</tr>
</template>
<style>
  .v-table > .v-table__wrapper > table > tbody > tr > td.icon,
  .v-table > .v-table__wrapper > table > tbody > tr > th.icon,
  .v-table > .v-table__wrapper > table > thead > tr > td.icon,
  .v-table > .v-table__wrapper > table > thead > tr > th.icon,
  .v-table > .v-table__wrapper > table > tfoot > tr > td.icon,
  .v-table > .v-table__wrapper > table > tfoot > tr > th.icon {
    padding: 0 8px 0 4px;
    vertical-align: middle;
  }

  .v-table > .v-table__wrapper > table > tbody > tr > td .icon,
  .v-table > .v-table__wrapper > table > tbody > tr > th .icon,
  .v-table > .v-table__wrapper > table > thead > tr > td .icon,
  .v-table > .v-table__wrapper > table > thead > tr > th .icon,
  .v-table > .v-table__wrapper > table > tfoot > tr > td .icon,
  .v-table > .v-table__wrapper > table > tfoot > tr > th .icon {
    max-height: 1em;
  }
</style>
