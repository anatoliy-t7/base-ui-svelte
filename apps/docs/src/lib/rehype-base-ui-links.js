/**
 * Add target="_blank" to anchors pointing at https://base-ui.com.
 * @returns {(tree: { type?: string; tagName?: string; properties?: Record<string, unknown>; children?: unknown[] }) => void}
 */
export function rehypeBaseUiLinks() {
	return (tree) => {
		walk(tree);
	};
}

/**
 * @param {unknown} node
 */
function walk(node) {
	if (!node || typeof node !== 'object') return;

	const el =
		/** @type {{ type?: string; tagName?: string; properties?: Record<string, unknown>; children?: unknown[] }} */ (
			node
		);

	if (el.type === 'element' && el.tagName === 'a') {
		const href = el.properties?.href;
		if (isBaseUiHref(href)) {
			el.properties = el.properties ?? {};
			el.properties.target = '_blank';
			el.properties.rel = 'noopener noreferrer';
		}
	}

	if (Array.isArray(el.children)) {
		for (const child of el.children) walk(child);
	}
}

/**
 * @param {unknown} href
 */
function isBaseUiHref(href) {
	if (typeof href !== 'string') return false;
	return href === 'https://base-ui.com' || href.startsWith('https://base-ui.com/');
}
