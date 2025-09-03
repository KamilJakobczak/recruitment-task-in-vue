const rateCache = new Map<string, { rate: number; timestamp: number }>();
const TTL_MS = 60 * 60 * 1000; // 1 hour cache duration

export async function plnToCurrency(currency: string): Promise<number> {
	const normalized = currency.toLowerCase();

	// PLN is base currency — no conversion needed
	if (normalized === 'pln') return 1;

	const cached = rateCache.get(normalized);
	const now = Date.now();

	// Use cached rate if it's still valid
	if (cached && now - cached.timestamp < TTL_MS) {
		return cached.rate;
	}

	try {
		const res = await fetch(
			`${import.meta.env.BASE_URL}currency/pln-to-${normalized}`
		);
		if (!res.ok) throw new Error(`Failed to fetch rate for ${normalized}`);

		const text = await res.text();
		const rate = Number(text.trim());

		if (isNaN(rate) || rate <= 0) {
			throw new Error(`Invalid rate received: ${text}`);
		}

		// Cache the fetched rate
		rateCache.set(normalized, { rate, timestamp: now });

		return rate;
	} catch (err) {
		console.error(`Currency fetch error for ${normalized}:`, err);
		return 1; // fallback to neutral rate to avoid crashing
	}
}
