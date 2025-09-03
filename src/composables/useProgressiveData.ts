import { markRaw, ref, shallowRef, type Ref } from 'vue';

export function useProgressiveData<T extends object>(
	fetcher: () => Promise<string>,
	parser: (input: string) => T[],
	chunkSize = 1000
) {
	// Full parsed dataset (raw, untouched)
	const fullData = shallowRef<T[]>([]);

	// Incrementally injected data for rendering
	const data: Ref<T[]> = ref([]);

	// Flag to indicate when all data has been injected
	const isFullyLoaded = ref(false);

	// Calculates loading progress as a percentage
	const loadingProgress = ref(0);

	// Injects data chunks progressively using requestIdleCallback
	function progRowInject() {
		let index = chunkSize;

		function injectNextChunk(deadline: IdleDeadline) {
			while (deadline.timeRemaining() > 0 && index < fullData.value.length) {
				const nextChunk = fullData.value.slice(index, index + chunkSize);
				data.value.push(...nextChunk);
				index += chunkSize;
			}
			const totalLength = fullData.value.length;

			if (totalLength > 0) {
				loadingProgress.value = Math.min(
					100,
					Math.floor((data.value.length / totalLength) * 100)
				);
			}

			if (index < fullData.value.length) {
				requestIdleCallback(injectNextChunk);
			} else {
				// Slight delay to allow progress bar to visually complete
				setTimeout(() => {
					isFullyLoaded.value = true;
					loadingProgress.value = 100;
				}, 300);
			}
		}

		requestIdleCallback(injectNextChunk);
	}

	// Fetch and parse data on mount, then start progressive injection
	function load() {
		loadingProgress.value = 0;
		isFullyLoaded.value = false;
		data.value = [];
		fullData.value = [];
		fetcher().then(res => {
			const parsed = parser(res).map(row => markRaw(row));
			fullData.value = parsed;
			data.value = parsed.slice(0, chunkSize); // Initial chunk;
			progRowInject();
		});
	}

	return {
		data,
		isFullyLoaded,
		loadingProgress,
		load,
	};
}
