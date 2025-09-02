import { ref, watchEffect, type Ref } from 'vue';
import { plnToCurrency } from '../utils';
import type { Data, GroupByKey } from '../App.vue';

export function useTotals(
	groupedData: Ref<Map<string, Data[]>>,
	groupBy: Ref<GroupByKey>
) {
	// Stores computed totals for each group
	const totals = ref<Record<string, number>>({});

	// Calculates total amount, optionally converting to PLN
	async function totalGet(
		items: { amount: number; currency: string }[],
		convert: boolean
	): Promise<number> {
		if (!convert) {
			return items.reduce((acc, curr) => acc + curr.amount, 0);
		}

		const uniqueCurrencies = [...new Set(items.map(item => item.currency))];
		const ratesMap: Record<string, number> = {};

		await Promise.all(
			uniqueCurrencies.map(async currency => {
				ratesMap[currency] = await plnToCurrency(currency);
			})
		);

		return items.reduce((acc, curr) => {
			const amount = Number(curr.amount);
			const rate = ratesMap[curr.currency];
			return acc + amount / rate;
		}, 0);
	}

	// Recomputes totals whenever grouped data or groupBy key changes
	watchEffect(async () => {
		const newTotals: Record<string, number> = {};

		for (const [key, rows] of groupedData.value.entries()) {
			const normalized = rows.map(item => ({
				amount: Number(item.amount),
				currency: item.currency?.toLowerCase(),
			}));

			const convert = groupBy.value !== 'currency';
			newTotals[key] = await totalGet(normalized, convert);
		}

		totals.value = newTotals;
	});

	return totals;
}
