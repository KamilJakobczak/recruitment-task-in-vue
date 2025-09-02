import { ref, computed } from 'vue';
export function useScrollSync(
	rowHeight: number,
	visibleRows: number,
	buffer = 5
) {
	const scrollTop = ref(0);

	const startIndex = computed(() =>
		Math.max(0, Math.floor(scrollTop.value / rowHeight) - buffer)
	);

	const endIndex = computed(() => startIndex.value + visibleRows + buffer * 2);

	function onScroll(event: Event) {
		scrollTop.value = (event.target as HTMLElement).scrollTop;
	}

	return {
		scrollTop,
		startIndex,
		endIndex,
		onScroll,
	};
}
