/** Escape HTML for safe {@html} rendering. */
function escapeHtml(text: string): string {
	return text
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');
}

/** Minimal markdown → HTML for API prop descriptions. */
export function renderDescriptionMarkdown(source: string): string {
	const normalized = source.replace(/\\n/g, '\n').trim();
	if (!normalized) return '';

	const blocks = normalized.split(/\n{2,}/);
	const htmlBlocks: string[] = [];

	for (const block of blocks) {
		const trimmed = block.trim();
		if (!trimmed) continue;

		if (/^[-*]\s/m.test(trimmed)) {
			const items = trimmed
				.split('\n')
				.map((line) => line.replace(/^[-*]\s+/, '').trim())
				.filter(Boolean)
				.map((item) => `<li>${inlineMarkdown(item.replace(/\n/g, ' '))}</li>`)
				.join('');
			htmlBlocks.push(`<ul>${items}</ul>`);
			continue;
		}

		htmlBlocks.push(`<p>${inlineMarkdown(trimmed.replace(/\n/g, ' '))}</p>`);
	}

	return htmlBlocks.join('');
}

function inlineMarkdown(text: string): string {
	let out = escapeHtml(text);

	out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
	out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

	return out;
}
