export type FilterOptions = Intl.CollatorOptions & {
	/** Locale for string comparison. Defaults to the runtime locale. */
	locale?: Intl.LocalesArgument | undefined;
};

export type Filter = {
	/** Whether the item matches the query anywhere. */
	contains: <Item>(
		item: Item,
		query: string,
		itemToString?: ((item: Item) => string) | undefined,
	) => boolean;
	/** Whether the item starts with the query. */
	startsWith: <Item>(
		item: Item,
		query: string,
		itemToString?: ((item: Item) => string) | undefined,
	) => boolean;
	/** Whether the item ends with the query. */
	endsWith: <Item>(
		item: Item,
		query: string,
		itemToString?: ((item: Item) => string) | undefined,
	) => boolean;
};

function stringifyAsLabel<Item>(
	item: Item,
	itemToString?: ((item: Item) => string) | undefined,
): string {
	if (itemToString) return itemToString(item);
	if (item == null) return '';
	if (typeof item === 'string') return item;
	if (typeof item === 'number' || typeof item === 'boolean' || typeof item === 'bigint') {
		return String(item);
	}
	if (typeof item === 'object' && 'label' in item && typeof item.label === 'string') {
		return item.label;
	}
	if (typeof item === 'object' && 'value' in item) {
		const value = (item as { value: unknown }).value;
		return value == null ? '' : String(value);
	}
	return String(item);
}

function stringifyLocale(locale: Intl.LocalesArgument | undefined): string {
	if (locale == null) return '';
	if (typeof locale === 'string') return locale;
	if (Array.isArray(locale)) return locale.map(String).join(',');
	return String(locale);
}

const filterCache = new Map<string, Filter>();

/**
 * Matches items against a query using `Intl.Collator` (Base UI `useFilter` / `getFilter`).
 * Not a React hook — call once (e.g. at module scope or in component setup) and reuse.
 */
export function useFilter(options: FilterOptions = {}): Filter {
	const mergedOptions: Intl.CollatorOptions = {
		usage: 'search',
		sensitivity: 'base',
		ignorePunctuation: true,
		...options,
	};
	const cacheKey = `${stringifyLocale(options.locale)}|${JSON.stringify(mergedOptions)}`;
	const cached = filterCache.get(cacheKey);
	if (cached) return cached;

	const collator = new Intl.Collator(options.locale, mergedOptions);
	const filter: Filter = {
		contains(item, query, itemToString) {
			if (!query) return true;
			const itemString = stringifyAsLabel(item, itemToString);
			for (let i = 0; i <= itemString.length - query.length; i += 1) {
				if (collator.compare(itemString.slice(i, i + query.length), query) === 0) {
					return true;
				}
			}
			return false;
		},
		startsWith(item, query, itemToString) {
			if (!query) return true;
			const itemString = stringifyAsLabel(item, itemToString);
			return collator.compare(itemString.slice(0, query.length), query) === 0;
		},
		endsWith(item, query, itemToString) {
			if (!query) return true;
			const itemString = stringifyAsLabel(item, itemToString);
			const queryLength = query.length;
			return (
				itemString.length >= queryLength &&
				collator.compare(itemString.slice(itemString.length - queryLength), query) === 0
			);
		},
	};
	filterCache.set(cacheKey, filter);
	return filter;
}

/** @deprecated Prefer {@link useFilter}; alias for Base UI naming. */
export const createFilter = useFilter;
