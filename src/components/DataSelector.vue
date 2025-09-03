<template>
	<div>
		<label for="">Data size: </label>
		<label v-for="size in dataSizes" :key="size">
			{{ size }}
			<input type="radio" :value="size" :checked="modelValue === size"
				@change="$emit('update:modelValue', size)" />
		</label>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	dataSizes: readonly string[];
	modelValue: string;
}>();
defineEmits(['update:modelValue']);
</script>
