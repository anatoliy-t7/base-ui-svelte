const COLLECTION_BRAND: unique symbol = Symbol('base-ui-svelte.combobox.createItems');

export type ComboboxCollectionItem = {
	readonly value: string;
	readonly label: string;
};

export type ComboboxItemCollection = {
	readonly [COLLECTION_BRAND]: true;
	/** Normalized `{ value, label }` rows derived from source items. */
	readonly data: ReadonlyArray<ComboboxCollectionItem>;
	/** Resolve a label for a derived value when present in the collection. */
	label(value: string): string | undefined;
};

export type CreateItemsOptions<T> = {
	getValue: (item: T) => string;
	getLabel: (item: T) => string;
};

/**
 * Builds an opaque item collection for {@link Combobox.Root}'s `items` prop.
 *
 * Use when application state should store a primitive ID while rendering still
 * receives source objects via `getValue` / `getLabel`.
 *
 * @example
 * ```ts
 * const items = createItems(users, {
 *   getValue: (user) => user.id,
 *   getLabel: (user) => user.name,
 * });
 * ```
 */
export function createItems<T>(
	items: ReadonlyArray<T>,
	options: CreateItemsOptions<T>,
): ComboboxItemCollection {
	const data = items.map((item) => ({
		value: options.getValue(item),
		label: options.getLabel(item),
	}));
	const byValue = new Map(data.map((entry) => [entry.value, entry.label] as const));

	return {
		[COLLECTION_BRAND]: true,
		data,
		label(value: string) {
			return byValue.get(value);
		},
	};
}

export function isItemCollection(value: unknown): value is ComboboxItemCollection {
	return (
		typeof value === 'object' &&
		value !== null &&
		COLLECTION_BRAND in value &&
		(value as ComboboxItemCollection)[COLLECTION_BRAND] === true
	);
}
