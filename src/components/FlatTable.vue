<template>
	<!-- Scrollable container for virtualized flat table -->
	<div class="flatTableContainer" @scroll="$emit('scroll', $event)" ref="container">

		<!-- Header row with dynamic column widths -->
		<div class="flat-header-row">
			<div v-for="key in flatHeaders" :key="key"
				:style="{ ...getFlexStyle(key), padding: '4px' }" class="flat-header-cell">
				{{ key }}
			</div>
		</div>

		<!-- Spacer div to simulate full scroll height -->
		<div :style="{ height: totalHeight + 'px', position: 'relative' }">

			<!-- Visible rows rendered absolutely for virtual scroll -->
			<div v-for="(row, index) in visibleFlatData" v-memo="[row]" :key="flatStartIndex + index"
				:style="{
					position: 'absolute',
					transform: `translateY(${(flatStartIndex + index) * rowHeight}px)`,
					height: rowHeight + 'px',
					width: '100%',
					display: 'flex',
				}">
				<!-- Editable cells for each column -->
				<div v-for="key in flatHeaders" :key="key"
					:style="{ ...getFlexStyle(key), padding: '4px' }">
					<input type="text" v-model="row[key]" class="flat-input" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Data } from '../App.vue';
import { getFlexStyle } from '../utils';

defineProps<{
	flatHeaders: string[];
	visibleFlatData: Data[];
	totalHeight: number;
	rowHeight: number;
	flatStartIndex: number;
}>();

defineEmits(['scroll']);
</script>