import { computed, type Ref } from 'vue';
import { type GroupByKey } from '../App.vue';

export function useGroupedRows(
	groupedData: Ref<Map<string, Record<string, string>[]>>,
	groupBy: Ref<GroupByKey>,
	hidden: Set<string>
) {
	// Returns a flat row with the groupBy key removed
	function filteredRow(
		row: Record<string, string>,
		groupByKey: string
	): string[] {
		return Object.entries(row)
			.filter(([key]) => key !== groupByKey)
			.map(([, value]) => value);
	}

	// Builds a flat list of rows for rendering: group headers, data rows, and totals
	const allGroupedRows = computed(() => {
		const rows: {
			type: 'group' | 'data' | 'total';
			key: string;
			flatRow?: string[];
		}[] = [];

		for (const [key, group] of groupedData.value.entries()) {
			rows.push({ type: 'group', key });

			if (!hidden.has(key)) {
				for (const row of group) {
					const flatRow = filteredRow(row, groupBy.value);
					rows.push({ type: 'data', key, flatRow });
				}

				if (group.length > 1) {
					rows.push({ type: 'total', key });
				}
			}
		}

		return rows;
	});

	return { allGroupedRows };
}
