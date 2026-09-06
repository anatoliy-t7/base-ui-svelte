<script lang="ts">
	import { setContext } from 'svelte';
	import { createControllableOpen, useId } from '../internal/controllable.svelte.js';
	import { COMBOBOX_CONTEXT } from '../internal/context-keys.js';
	import { createPresence } from '../internal/presence.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import { isItemCollection } from './create-items.js';
	import type {
		ComboboxCollectionItem,
		ComboboxContext,
		ComboboxInputChangeEventDetails,
		ComboboxItemEntry,
		ComboboxRefs,
		ComboboxRootProps,
		ComboboxValue,
	} from './types.js';

	let {
		value = $bindable(undefined),
		defaultValue,
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
		required = false,
		name,
		form,
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
		multiple = false,
		loopFocus = true,
		modal = false,
		openOnInputClick = true,
		items: itemsProp,
		class: className,
		style,
		id = useId('combobox'),
		children,
		...rest
	}: ComboboxRootProps = $props();

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

	const resolvedDefaultValue = $derived.by((): ComboboxValue => {
		if (defaultValue !== undefined) return defaultValue;
		return multiple ? [] : null;
	});

	let uncontrolledValue = $state<ComboboxValue | undefined>(undefined);
	let uncontrolledInput = $state<string | undefined>(undefined);
	let items = $state<ComboboxItemEntry[]>([]);
	let highlighted = $state<string | null>(null);

	const isValueControlled = $derived(value !== undefined);
	const currentValue = $derived(
		value !== undefined ? value : (uncontrolledValue ?? resolvedDefaultValue),
	);

	const isInputControlled = $derived(inputValue !== undefined);
	const currentInputValue = $derived(
		inputValue !== undefined ? inputValue : (uncontrolledInput ?? defaultInputValue),
	);

	const collectionItems = $derived.by((): ReadonlyArray<ComboboxCollectionItem> => {
		if (!itemsProp) return [];
		if (isItemCollection(itemsProp)) return itemsProp.data;
		return itemsProp.map((item) => ({
			value: item.value,
			label: item.label ?? item.value,
		}));
	});

	const collectionLabel = $derived.by(() => {
		if (itemsProp && isItemCollection(itemsProp)) {
			return (value: string) => itemsProp.label(value);
		}
		return undefined;
	});

	const presence = createPresence(() => openState.open);

	const refs: ComboboxRefs = {
		input: null,
		trigger: null,
		popup: null,
		positioner: null,
		list: null,
		arrow: null,
	};

	const inputId = useId('combobox-input');
	const listId = useId('combobox-list');
	let labelId = $state<string | undefined>(undefined);

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

	function getSelectedValues(): string[] {
		if (currentValue == null) return [];
		if (Array.isArray(currentValue)) return [...currentValue];
		return [currentValue];
	}

	function isSelected(itemValue: string): boolean {
		return getSelectedValues().some((entry) => valuesEqual(entry, itemValue));
	}

	function setValue(next: ComboboxValue, event: Event): void {
		if (disabled || readOnly) return;
		if (isValueControlled) {
			value = next;
		} else {
			uncontrolledValue = next;
		}
		onValueChange?.(next, event);
	}

	function createInputChangeDetails(
		reason: ComboboxInputChangeEventDetails['reason'],
		isItemPress = false,
	): ComboboxInputChangeEventDetails {
		let canceled = false;
		return {
			reason,
			isItemPress,
			cancel() {
				canceled = true;
			},
			get isCanceled() {
				return canceled;
			},
		};
	}

	function setInputValue(
		next: string,
		event?: Event,
		options?: { reason?: ComboboxInputChangeEventDetails['reason']; isItemPress?: boolean },
	): void {
		if (disabled || readOnly) return;
		const reason = options?.reason ?? 'input';
		const isItemPress = options?.isItemPress ?? false;
		const details = createInputChangeDetails(reason, isItemPress);
		onInputChange?.(next, details, event);
		if (details.isCanceled) return;
		if (isInputControlled) {
			inputValue = next;
		} else {
			uncontrolledInput = next;
		}
	}

	function setOpen(next: boolean, reason: Parameters<ComboboxContext['setOpen']>[1]): void {
		if (disabled && next) return;
		openState.setOpen(next, reason);
		if (next) {
			const visible = getVisibleItems();
			const selected = visible.find((item) => isSelected(item.value));
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
		const fromCollection = collectionLabel?.(itemValue);
		if (fromCollection) return fromCollection;
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

	function getVisibleItems(): ComboboxItemEntry[] {
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

	function getLabelForValue(itemValue: string): string {
		const registered = items.find((item) => item.value === itemValue);
		if (registered) return registered.label;
		const fromCollection = collectionLabel?.(itemValue);
		if (fromCollection) return fromCollection;
		const collection = collectionItems.find((item) => item.value === itemValue);
		if (collection) return collection.label;
		return itemValue;
	}

	function selectItem(itemValue: string, label: string, event: Event): void {
		if (multiple) {
			const selected = getSelectedValues();
			const next = selected.includes(itemValue)
				? selected.filter((entry) => entry !== itemValue)
				: [...selected, itemValue];
			setValue(next, event);
			setInputValue('', event, { reason: 'clear', isItemPress: true });
			return;
		}

		setValue(itemValue, event);
		setInputValue(label, event, { reason: 'item-press', isItemPress: true });
		setOpen(false, 'imperative-action');
	}

	function removeValue(itemValue: string, event: Event): void {
		if (disabled || readOnly) return;
		if (multiple) {
			setValue(
				getSelectedValues().filter((entry) => entry !== itemValue),
				event,
			);
			return;
		}
		if (currentValue === itemValue) {
			setValue(null, event);
			setInputValue('', event, { reason: 'clear' });
		}
	}

	function clear(event: Event): void {
		setValue(multiple ? [] : null, event);
		setInputValue('', event, { reason: 'clear' });
	}

	function getSelectedLabel(): string | null {
		const selected = getSelectedValues();
		if (selected.length === 0) return null;
		if (selected.length === 1) {
			const only = selected[0];
			return only != null ? getLabelForValue(only) : null;
		}
		return selected.map((entry) => getLabelForValue(entry)).join(', ');
	}

	setContext(COMBOBOX_CONTEXT, {
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
		get required() {
			return required;
		},
		get name() {
			return name;
		},
		get form() {
			return form;
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
		get multiple() {
			return multiple;
		},
		get loopFocus() {
			return loopFocus;
		},
		get modal() {
			return modal;
		},
		get openOnInputClick() {
			return openOnInputClick;
		},
		isSelected,
		removeValue,
		getSelectedValues,
		getLabelForValue,
		get collectionItems() {
			return collectionItems;
		},
		selectItem,
	} satisfies ComboboxContext);

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

	const selectedValues = $derived(getSelectedValues());
	const serializedValue = $derived((currentValue as string | null) ?? '');
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

	{#if name && !disabled}
		{#if multiple}
			{#each selectedValues as selectedValue (selectedValue)}
				<input type="hidden" {name} {form} value={selectedValue} />
			{/each}
		{:else}
			<input type="hidden" {name} {form} value={serializedValue} required={required || undefined} />
		{/if}
	{/if}
</div>
