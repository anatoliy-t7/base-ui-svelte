<script lang="ts">
	import { setContext } from 'svelte';
	import { createControllableOpen, useId } from '../internal/controllable.svelte.js';
	import { AUTOCOMPLETE_CONTEXT } from '../internal/context-keys.js';
	import { createPresence } from '../internal/presence.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type {
		AutocompleteContext,
		AutocompleteItemEntry,
		AutocompleteRefs,
		AutocompleteRootProps,
	} from './types.js';

	let {
		value = $bindable(undefined),
		defaultValue = null,
		onValueChange,
		inputValue = $bindable(undefined),
		defaultInputValue = '',
		onInputChange,
		open = $bindable(undefined),
		defaultOpen = false,
		onOpenChange,
		onOpenChangeComplete,
		disabled = false,
		readOnly = false,
		filter = true,
		filteredItems,
		limit = -1,
		locale,
		autoHighlight = false,
		highlightItemOnHover = true,
		onItemHighlighted,
		itemToStringLabel,
		itemToStringValue,
		isItemEqualToValue,
		loopFocus = true,
		items: itemsProp,
		class: className,
		style,
		id = useId('autocomplete'),
		children,
		...rest
	}: AutocompleteRootProps = $props();

	const openState = createControllableOpen({
		getOpen: () => open,
		getDefaultOpen: () => defaultOpen,
		onOpenChange: (next, eventDetails) => {
			onOpenChange?.(next, eventDetails);
		},
		setOpenProp: (next) => {
			open = next;
		},
	});

	let uncontrolledValue = $state<string | null | undefined>(undefined);
	let uncontrolledInput = $state<string | undefined>(undefined);
	let items = $state<AutocompleteItemEntry[]>([]);
	let highlighted = $state<string | null>(null);

	const isValueControlled = $derived(value !== undefined);
	const currentValue = $derived(value !== undefined ? value : (uncontrolledValue ?? defaultValue));

	const isInputControlled = $derived(inputValue !== undefined);
	const currentInputValue = $derived(
		inputValue !== undefined ? inputValue : (uncontrolledInput ?? defaultInputValue),
	);

	const collectionItems = $derived.by(() => {
		if (!itemsProp) return [];
		return itemsProp.map((item) => ({
			value: item.value,
			label: item.label ?? item.value,
		}));
	});

	const presence = createPresence(() => openState.open);

	let lastReportedOpen: boolean | undefined = undefined;
	let hasSyncedComplete = false;

	$effect(() => {
		const present = presence.isPresent;
		const ending = presence.isEnding;
		const starting = presence.isStarting;
		const openNow = openState.open;

		if (!hasSyncedComplete) {
			hasSyncedComplete = true;
			lastReportedOpen = openNow;
			return;
		}

		if (openNow && present && !starting) {
			if (lastReportedOpen !== true) {
				lastReportedOpen = true;
				onOpenChangeComplete?.(true);
			}
			return;
		}
		if (!openNow && !present && !ending) {
			if (lastReportedOpen !== false) {
				lastReportedOpen = false;
				onOpenChangeComplete?.(false);
			}
		}
	});


	const refs: AutocompleteRefs = {
		input: null,
		trigger: null,
		popup: null,
		positioner: null,
		list: null,
		arrow: null,
	};

	const inputId = useId('autocomplete-input');
	const listId = useId('autocomplete-list');
	let labelId = $state<string | undefined>(undefined);

	function setValue(next: string | null, event: Event): void {
		if (disabled || readOnly) return;
		if (isValueControlled) {
			value = next;
		} else {
			uncontrolledValue = next;
		}
		onValueChange?.(next, event);
	}

	function setInputValue(next: string, event?: Event): void {
		if (disabled || readOnly) return;
		if (isInputControlled) {
			inputValue = next;
		} else {
			uncontrolledInput = next;
		}
		onInputChange?.(next, event);
	}

	function setOpen(next: boolean, reason: Parameters<AutocompleteContext['setOpen']>[1]): void {
		if (disabled && next) return;
		openState.setOpen(next, reason);
		if (next) {
			const visible = getVisibleItems();
			const selected = visible.find((item) => item.value === currentValue);
			highlighted = selected?.value ?? visible[0]?.value ?? null;
		} else {
			highlighted = null;
		}
	}

	function registerItem(
		itemId: string,
		itemValue: string,
		label: string,
		element: HTMLElement,
	): () => void {
		queueMicrotask(() => {
			const existing = items.find((item) => item.id === itemId);
			if (existing) {
				existing.label = label;
				return;
			}
			items.push({ id: itemId, value: itemValue, label, element });
		});
		return () => {
			items = items.filter((item) => item.id !== itemId);
		};
	}

	function getItemId(itemValue: string): string {
		return `${listId}-option-${itemValue}`;
	}

	function resolveLabel(itemValue: string, fallbackLabel?: string): string {
		if (itemToStringLabel) return itemToStringLabel(itemValue);
		if (fallbackLabel) return fallbackLabel;
		const registered = items.find((item) => item.value === itemValue);
		if (registered) return registered.label;
		const collection = collectionItems.find((item) => item.value === itemValue);
		if (collection) return collection.label;
		return itemValue;
	}

	function matchesFilter(itemValue: string, label: string): boolean {
		if (filter === false) return true;
		const query = currentInputValue.trim();
		if (!query) return true;
		if (typeof filter === 'function') {
			return filter(itemValue, query, label);
		}
		const normalizedQuery = locale
			? query.toLocaleLowerCase(locale)
			: query.toLowerCase();
		const normalizedLabel = locale ? label.toLocaleLowerCase(locale) : label.toLowerCase();
		return normalizedLabel.includes(normalizedQuery);
	}

	function valuesEqual(a: string, b: string): boolean {
		if (isItemEqualToValue) return isItemEqualToValue(a, b);
		return Object.is(a, b);
	}

	function getVisibleItems(): AutocompleteItemEntry[] {
		let visible = items;
		if (filteredItems) {
			const allowed = new Set(filteredItems);
			visible = items.filter((item) => allowed.has(item.value));
		} else {
			visible = items.filter((item) => matchesFilter(item.value, item.label));
		}
		if (limit >= 0) {
			visible = visible.slice(0, limit);
		}
		return visible;
	}


	$effect(() => {
		if (!autoHighlight || !openState.open) return;
		const query = currentInputValue.trim();
		if (!query) return;
		const next = getVisibleItems()[0]?.value ?? null;
		if (highlighted !== next) {
			highlighted = next;
			onItemHighlighted?.(next, { reason: 'filter' });
		}
	});

	function isItemVisible(itemValue: string): boolean {
		const entry = items.find((item) => item.value === itemValue);
		if (!entry) return true;
		return getVisibleItems().some((item) => item.value === itemValue);
	}

	function selectItem(itemValue: string, label: string, event: Event): void {
		setValue(itemValue, event);
		setInputValue(label, event);
		setOpen(false, 'imperative-action');
	}

	function clear(event: Event): void {
		setValue(null, event);
		setInputValue('', event);
	}

	function getSelectedLabel(): string | null {
		if (currentValue == null) return null;
		const registered = items.find((item) => item.value === currentValue);
		if (registered) return registered.label;
		const collection = collectionItems.find((item) => item.value === currentValue);
		if (collection) return collection.label;
		return currentValue;
	}

	setContext(AUTOCOMPLETE_CONTEXT, {
		get value() {
			return currentValue;
		},
		setValue,
		get inputValue() {
			return currentInputValue;
		},
		setInputValue,
		clear,
		get open() {
			return openState.open;
		},
		setOpen,
		registerItem,
		get highlighted() {
			return highlighted;
		},
		setHighlighted: (next, reason: 'none' | 'keyboard' | 'pointer' | 'filter' = 'none') => {
			highlighted = next;
			onItemHighlighted?.(next, { reason });
		},
		get items() {
			return items;
		},
		getVisibleItems,
		isItemVisible,
		getItemId,
		getSelectedLabel,
		inputId,
		listId,
		get labelId() {
			return labelId;
		},
		setLabelId: (next) => {
			labelId = next;
		},
		refs,
		presence,
		get disabled() {
			return disabled;
		},
		get readOnly() {
			return readOnly;
		},
		get loopFocus() {
			return loopFocus;
		},
		get filter() {
			return filter;
		},
		get highlightItemOnHover() {
			return highlightItemOnHover;
		},
		get autoHighlight() {
			return autoHighlight;
		},
		get collectionItems() {
			return collectionItems;
		},
		selectItem,
	} satisfies AutocompleteContext);

	const rootProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			class: className,
			style,
			'data-open': openState.open ? '' : undefined,
			'data-closed': !openState.open ? '' : undefined,
			'data-disabled': disabled ? '' : undefined,
			'data-readonly': readOnly ? '' : undefined,
		}),
	);
</script>

<div {...rootProps} style={typeof rootProps.style === 'string' ? rootProps.style : undefined}>
	{#if children}
		{@render children({
			value: currentValue,
			inputValue: currentInputValue,
			open: openState.open,
			disabled,
		})}
	{/if}
</div>
