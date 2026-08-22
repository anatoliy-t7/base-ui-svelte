/**
 * Merges prop objects for headless components.
 * Later objects win for most keys; `class` is concatenated; event handlers are composed.
 */
export function mergeProps(
	...propsList: Array<object | null | undefined>
): Record<string | symbol, unknown> {
	const result: Record<string | symbol, unknown> = {};

	for (const props of propsList) {
		if (!props) continue;

		const record = props as Record<string | symbol, unknown>;
		for (const key of Object.keys(record)) {
			const value = record[key];
			const existing = result[key];

			if (value === undefined) continue;

			if (key === 'class' || key === 'className') {
				const a = typeof result.class === 'string' ? result.class : '';
				const b = typeof value === 'string' ? value : '';
				result.class = [a, b].filter(Boolean).join(' ');
				continue;
			}

			if (key === 'style') {
				result.style = mergeStyles(existing, value);
				continue;
			}

			if (isEventHandlerKey(key) && typeof existing === 'function' && typeof value === 'function') {
				const prev = existing as (...args: unknown[]) => void;
				const next = value as (...args: unknown[]) => void;
				result[key] = (...args: unknown[]) => {
					prev(...args);
					next(...args);
				};
				continue;
			}

			result[key] = value;
		}

		for (const key of Object.getOwnPropertySymbols(record)) {
			const value = record[key];
			if (value !== undefined) {
				result[key] = value;
			}
		}
	}

	return result;
}

function isEventHandlerKey(key: string): boolean {
	return /^on[a-zA-Z]/.test(key) || key.startsWith('on:');
}

function mergeStyles(a: unknown, b: unknown): string | Record<string, string> {
	if (typeof a === 'string' && typeof b === 'string') {
		return `${a};${b}`;
	}
	if (typeof a === 'object' && a !== null && typeof b === 'object' && b !== null) {
		return { ...(a as Record<string, string>), ...(b as Record<string, string>) };
	}
	if (typeof b === 'string') return b;
	if (typeof b === 'object' && b !== null) return b as Record<string, string>;
	if (typeof a === 'string') return a;
	if (typeof a === 'object' && a !== null) return a as Record<string, string>;
	return '';
}
