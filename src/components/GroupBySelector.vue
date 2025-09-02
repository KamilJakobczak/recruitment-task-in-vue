<template>
	<!-- Grouping selector UI -->
	<div class="groupingSelection">
		<label for="groupBy">Group by:</label>

		<!-- Render one button per grouping option -->
		<button v-for="option in options" :key="option" @click="$emit('update:modelValue', option)"
			:class="{ active: modelValue === option }">
			{{ option.charAt(0).toUpperCase() + option.slice(1) }}
		</button>
	</div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: string; options: string[] }>();
defineEmits(['update:modelValue']);
</script>