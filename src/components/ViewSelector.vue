<template>
	<div>
		<label>
			xml
			<input
				type="radio"
				value="xml"
				:checked="modelValue === 'xml'"
				@change="$emit('update:modelValue', 'xml')" />
		</label>
		<label>
			table
			<input
				type="radio"
				value="table"
				:checked="modelValue === 'table'"
				@change="$emit('update:modelValue', 'table')" />
		</label>
	</div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: 'xml' | 'table' }>();
defineEmits(['update:modelValue']);
</script>
