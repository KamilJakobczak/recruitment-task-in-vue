export function dataGroup<T extends Record<string, any>, K extends keyof T>(
	input: T[],
	key: K
): Map<string, T[]> {
	const result = new Map<string, T[]>();

	for (const row of input) {
		const groupKey = String(row[key]); // normalize key
		if (!result.has(groupKey)) result.set(groupKey, []);
		result.get(groupKey)!.push(row); // push original row
	}

	return result;
}
