import { computed, ref, watch, type Ref } from 'vue';
import { debounce, dataGroup } from '../utils';

export function useGroupedData<
	T extends Record<string, any>,
	K extends keyof T
>(source: Ref<T[] | null>, groupBy: Ref<K>) {
	// Holds the grouped rows as a map keyed by group value
	const groupedData = ref<Map<string, T[]>>(new Map());

	// Updates the grouped data based on current source and groupBy key
	const update = () => {
		if (source.value) {
			groupedData.value = dataGroup(source.value, groupBy.value);
		} else {
			groupedData.value = new Map();
		}
	};

	// Debounced update for slower interactions (e.g. typing)
	const debouncedUpdate = debounce(update, 1000);

	// Immediate update when source or groupBy changes
	watch([source, groupBy], update, { immediate: true });

	// Extracts headers from the first item in the first group
	const headers = computed(() => {
		const firstGroup = Array.from(groupedData.value.values())[0];
		const firstItem = firstGroup?.[0];
		return firstItem
			? Object.keys(firstItem).filter(key => key !== groupBy.value)
			: [];
	});

	return { groupedData, headers, debouncedUpdate };
}
