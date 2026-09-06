<script lang="ts">
	import { setContext } from 'svelte';
	import { createControllableOpen, useId } from '../internal/controllable.svelte.js';
	import { SELECT_CONTEXT } from '../internal/context-keys.js';
	import { createPresence } from '../internal/presence.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type {
		SelectCollectionItem,
		SelectContext,
		SelectItemEntry,
		SelectRefs,
		SelectRootProps,
		SelectValue,
	} from './types.js';

	let {
		value = $bindable(undefined),
		defaultValue,
		onValueChange,
		open = $bindable(undefined),
		defaultOpen = false,
		onOpenChange,
		onOpenChangeComplete,
		disabled = false,
		readOnly = false,
		required = false,
		form,
		autoComplete,
		highlightItemOnHover = true,
		itemToStringLabel,
		itemToStringValue,
		isItemEqualToValue,
		name,
		multiple = false,
		modal = true,
		items: itemsProp,
		class: className,
		style,
		id = useId('select'),
		children,
		...rest
	}: SelectRootProps = $props();

	const resolvedDefaultValue = $derived(
		defaultValue !== undefined ? defaultValue : multiple ? [] : null,
	);

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

	let uncontrolledValue = $state<SelectValue | undefined>(undefined);
	let registeredItems = $state<SelectItemEntry[]>([]);
	let highlighted = $state<string | null>(null);
	let labelCache = $state<Record<string, string>>({});

	const isValueControlled = $derived(value !== undefined);
	const currentValue = $derived(
		value !== undefined ? value : (uncontrolledValue ?? resolvedDefaultValue),
	);

	const collectionItems = $derived.by((): ReadonlyArray<SelectCollectionItem> => {
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


	const refs: SelectRefs = {
		trigger: null,
		popup: null,
		positioner: null,
		list: null,
		arrow: null,
	};

	const triggerId = useId('select-trigger');
	const listId = useId('select-list');
	let labelId = $state<string | undefined>(undefined);

	function getSelectedValues(): string[] {
		if (currentValue == null) return [];
		if (Array.isArray(currentValue)) return [...currentValue];
		return [currentValue];
	}

	function valuesEqual(a: string, b: string): boolean {
		if (isItemEqualToValue) return isItemEqualToValue(a, b);
		return Object.is(a, b);
	}

	function isSelected(itemValue: string): boolean {
		return getSelectedValues().some((entry) => valuesEqual(entry, itemValue));
	}

	function getLabelForValue(itemValue: string): string {
		if (itemToStringLabel) return itemToStringLabel(itemValue);
		const registered = registeredItems.find((item) => item.value === itemValue);
		if (registered?.label && registered.label !== itemValue) return registered.label;
		if (labelCache[itemValue]) return labelCache[itemValue];
		const collection = collectionItems.find((item) => item.value === itemValue);
		if (collection) return collection.label;
		return registered?.label ?? itemValue;
	}

	function getFormValue(itemValue: string): string {
		if (itemToStringValue) return itemToStringValue(itemValue);
		return itemValue;
	}

	function setValue(next: SelectValue, event: Event): void {
		if (disabled || readOnly) return;
		if (isValueControlled) {
			value = next;
		} else {
			uncontrolledValue = next;
		}
		onValueChange?.(next, event);
	}

	function setOpen(next: boolean, reason: Parameters<SelectContext['setOpen']>[1]): void {
		if (disabled && next) return;
		openState.setOpen(next, reason);
		if (next) {
			const visible = getVisibleItems();
			// Anchor highlight to the first selected item in rendered order.
			const firstSelected = visible.find((item) => isSelected(item.value));
			highlighted = firstSelected?.value ?? visible[0]?.value ?? null;
		} else {
			highlighted = null;
		}
	}

	function registerItem(itemId: string, itemValue: string, element: HTMLElement): () => void {
		queueMicrotask(() => {
			if (registeredItems.some((item) => item.id === itemId)) return;
			registeredItems.push({
				id: itemId,
				value: itemValue,
				label: labelCache[itemValue] ?? itemValue,
				element,
			});
		});
		return () => {
			registeredItems = registeredItems.filter((item) => item.id !== itemId);
		};
	}

	function setItemLabel(itemValue: string, label: string): void {
		const entry = registeredItems.find((item) => item.value === itemValue);
		if (entry && entry.label !== label) {
			entry.label = label;
		}
		if (labelCache[itemValue] !== label) {
			labelCache = { ...labelCache, [itemValue]: label };
		}
	}

	function getItemId(itemValue: string): string {
		return `${listId}-option-${itemValue}`;
	}

	function getVisibleItems(): SelectItemEntry[] {
		return registeredItems;
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

	function selectItem(itemValue: string, event: Event): void {
		if (readOnly) return;
		if (multiple) {
			const selected = getSelectedValues();
			const next = selected.includes(itemValue)
				? selected.filter((entry) => entry !== itemValue)
				: [...selected, itemValue];
			setValue(next, event);
			return;
		}
		setValue(itemValue, event);
		setOpen(false, 'imperative-action');
	}

	setContext(SELECT_CONTEXT, {
		get value() {
			return currentValue;
		},
		setValue,
		get open() {
			return openState.open;
		},
		setOpen,
		registerItem,
		setItemLabel,
		get highlighted() {
			return highlighted;
		},
		setHighlighted: (next) => {
			highlighted = next;
		},
		get items() {
			return registeredItems;
		},
		getVisibleItems,
		getItemId,
		triggerId,
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
		get form() {
			return form;
		},
		get highlightItemOnHover() {
			return highlightItemOnHover;
		},
		get name() {
			return name;
		},
		get multiple() {
			return multiple;
		},
		get modal() {
			return modal;
		},
		isSelected,
		getSelectedValues,
		getSelectedLabel,
		getLabelForValue,
		get collectionItems() {
			return collectionItems;
		},
		selectItem,
	} satisfies SelectContext);

	const rootProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			class: className,
			style,
			'data-open': openState.open ? '' : undefined,
			'data-closed': !openState.open ? '' : undefined,
			'data-disabled': disabled ? '' : undefined,
		}),
	);

	const selectedValues = $derived(getSelectedValues());
	const serializedValue = $derived((currentValue as string | null) ?? '');
</script>

<div {...rootProps} style={typeof rootProps.style === 'string' ? rootProps.style : undefined}>
	{#if children}
		{@render children({ value: currentValue, open: openState.open, disabled })}
	{/if}

	{#if name && !disabled}
		{#if multiple}
			{#each selectedValues as selectedValue (selectedValue)}
				<input
					type="hidden"
					{form}
					{required}
					autocomplete={autoComplete}
					{name}
					value={getFormValue(selectedValue)}
				/>
			{/each}
		{:else}
			<input
				type="hidden"
				{form}
				{required}
				autocomplete={autoComplete}
				{name}
				value={currentValue == null ? '' : Array.isArray(currentValue) ? currentValue.map(getFormValue).join(',') : getFormValue(currentValue)}
			/>
		{/if}
	{/if}
</div>
