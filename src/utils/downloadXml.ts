export function downloadXml(xml: string): void {
	const confirmed = window.confirm('Do you want to download the XML file?');

	if (!confirmed) return;

	const blob = new Blob([xml], { type: 'application/xml' });
	const url = URL.createObjectURL(blob);

	const a = document.createElement('a');
	a.href = url;
	a.download = 'export.xml';
	a.click();

	URL.revokeObjectURL(url);
}
