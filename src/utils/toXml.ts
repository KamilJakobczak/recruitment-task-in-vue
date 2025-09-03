export function toXml(input: Record<string, any>[]): string {
	const escape = (value: any) =>
		String(value)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&apos;');

	const records = input
		.map(obj => {
			const fields = Object.entries(obj)
				.map(([key, value]) => `<${key}>${escape(value)}</${key}>`)
				.join('');
			return `<record>${fields}</record>`;
		})
		.join('\n');

	return `<records>\n${records}\n</records>`;
}
