/** Short type label for collapsed API prop rows (matches Base UI summary). */
export function shortType(type: string): string {
	const normalized = type.replace(/\s+/g, ' ').trim();
	if (!normalized || normalized === 'unknown') return 'unknown';

	const withoutOptional = normalized.replace(/(\s*\|\s*undefined)+$/g, '').trim();

	if (/Snippet/i.test(withoutOptional)) return 'snippet';
	if (/=>\s*\)|=>\s*void|\(\([^)]*\)\s*=>/.test(withoutOptional)) return 'function';

	if (withoutOptional.includes(' | ')) {
		if (withoutOptional.length <= 40) return withoutOptional;
	}

	if (/\bboolean\b/.test(withoutOptional)) return 'boolean';
	if (/\bnumber\b/.test(withoutOptional)) return 'number';
	if (/\bstring\b/.test(withoutOptional)) return 'string';
	if (/\bnull\b/.test(withoutOptional)) return 'null';
	if (/Record<|Array<|\[\]/.test(withoutOptional)) return 'object';
	return withoutOptional.length > 28 ? `${withoutOptional.slice(0, 25)}…` : withoutOptional;
}

/** Format a Svelte/TS type for display in an expanded code block. */
export function formatTypeBlock(type: string): string {
	const normalized = type.replace(/\s+/g, ' ').trim();
	if (!normalized) return 'unknown';

	// Already multiline-ish union with leading pipes (from Base UI style)
	if (normalized.includes('| (') || normalized.startsWith('| (')) {
		return normalized
			.replace(/\|\s*/g, '\n| ')
			.replace(/^\|\s*/, '| ')
			.trim();
	}

	// Split long union types onto separate lines
	if (normalized.includes(' | ') && normalized.length > 60) {
		return normalized
			.split(' | ')
			.map((part, index) => (index === 0 ? part : `| ${part}`))
			.join('\n');
	}

	return normalized;
}

export function displayDefault(defaultValue: string): string {
	const trimmed = defaultValue.trim();
	if (!trimmed || trimmed === '—' || trimmed === '-') return '—';
	return trimmed;
}

export function hasDefault(defaultValue: string): boolean {
	const trimmed = defaultValue.trim();
	return Boolean(trimmed && trimmed !== '—' && trimmed !== '-');
}
