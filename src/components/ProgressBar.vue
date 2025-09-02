<template>
	<div
		v-if="!isFullyLoaded || loadingProgress < 100"
		class="progress-wrapper">
		<div
			class="progress-bar"
			:style="{ width: loadingProgress + '%' }"></div>
	</div>
</template>

<script setup lang="ts">
defineProps<{ isFullyLoaded: boolean; loadingProgress: number }>();
</script>
