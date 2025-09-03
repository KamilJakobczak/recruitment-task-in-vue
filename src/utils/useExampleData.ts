import { watch, type Ref } from 'vue';
import { useProgressiveData } from '../composables/useProgressiveData';
import { type DataSizes } from '../App.vue';
// Parses CSV string into an array of typed objects
function csvToArray<T extends Record<string, any>>(input: string): T[] {
	const lines = input.split('\n');
	if (lines.length < 2) return [];

	const headers = lines[0].split(',');
	const result: T[] = new Array(lines.length - 1);

	for (let i = 1; i < lines.length; i++) {
		const values = lines[i].split(',');
		const row: Record<string, string> = {};

		for (let j = 0; j < headers.length; j++) {
			row[headers[j]] = values[j] ?? '';
		}

		result[i - 1] = row as T;
	}

	return result;
}

// Loads and parses example CSV data using progressive injection
export function useExampleData<T extends Record<string, any>>(
	dataSize: Ref<DataSizes>
) {
	const fetcher = () =>
		fetch(
			`${import.meta.env.BASE_URL}test_data/test_data-${dataSize.value}.csv`
		).then(r => r.text());

	const { data, isFullyLoaded, loadingProgress, load } = useProgressiveData<T>(
		fetcher,
		csvToArray
	);

	// Watch for changes and reload
	watch(dataSize, () => {
		load();
	});

	// Initial load
	load();

	return { data, isFullyLoaded, loadingProgress };
}
