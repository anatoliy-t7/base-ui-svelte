/**
 * Restructure Base UI table-cell descriptions into readable markdown
 * (paragraphs + bullet lists for `'reason-code'` items).
 */
export function structureDescription(source: string): string {
	let text = source.replace(/&#xA;/g, '\n').trim();
	if (!text) return '';

	// Already structured — avoid double-processing on re-render
	if (/\n- `'/.test(text) || /\n- The /.test(text)) {
		return text.replace(/([a-z,])\n([a-z])/g, '$1 $2').trim();
	}

	text = text.replace(/\s+\*\*Warning\*\*:/g, '\n\n**Warning**:');

	text = text.replace(
		/\.\s+(The `(?:eventDetails\.reason|[a-zA-Z.]+)` indicates[^:]*:)\s*/gi,
		'.\n\n$1\n\n'
	);
	text = text.replace(/(what triggered the change:|triggered the change:)\s*/gi, '$1\n\n');

	text = text.replace(/:\n\n(`'[a-z0-9-]+'`)/g, ':\n\n- $1');
	text = text.replace(/([a-z0-9)])(`'[a-z0-9-]+'`)/g, '$1\n- $2');

	text = text.replace(/([^\n\s-])(`'[a-z0-9-]+'`:\s*)/g, '$1\n- $2');

	if (/\bwhen:\s*(?!-\s)/i.test(text)) {
		text = text.replace(/\bwhen:\s*/i, 'when:\n\n- ');
		text = text.replace(/\.([A-Z])/g, '.\n- $1');
	}

	text = text.replace(/([a-z,])\n([a-z])/g, '$1 $2');

	text = text
		.split('\n')
		.map((line) => line.replace(/[^\S\n]{2,}/g, ' ').trimEnd())
		.join('\n');

	return text.replace(/\n{3,}/g, '\n\n').trim();
}
