<script lang="ts">
	import { setContext } from 'svelte';
	import { createControllableOpen, useId } from '../internal/controllable.svelte.js';
	import { COMBOBOX_CONTEXT } from '../internal/context-keys.js';
	import { createPresence } from '../internal/presence.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type {
		ComboboxCollectionItem,
		ComboboxContext,
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
		return itemsProp.map((item) => ({
			value: item.value,
			label: item.label ?? item.value,
		}));
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
		return getSelectedValues().includes(itemValue);
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

	function setInputValue(next: string, event?: Event): void {
		if (disabled || readOnly) return;
		if (isInputControlled) {
			inputValue = next;
		} else {
			uncontrolledInput = next;
		}
		onInputChange?.(next, event);
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

	function matchesFilter(label: string): boolean {
		if (!filter) return true;
		const query = currentInputValue.trim().toLowerCase();
		if (!query) return true;
		return label.toLowerCase().includes(query);
	}

	function getVisibleItems(): ComboboxItemEntry[] {
		return items.filter((item) => matchesFilter(item.label));
	}

	function isItemVisible(itemValue: string): boolean {
		const entry = items.find((item) => item.value === itemValue);
		if (!entry) return true;
		return matchesFilter(entry.label);
	}

	function getLabelForValue(itemValue: string): string {
		const registered = items.find((item) => item.value === itemValue);
		if (registered) return registered.label;
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
			setInputValue('', event);
			return;
		}

		setValue(itemValue, event);
		setInputValue(label, event);
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
			setInputValue('', event);
		}
	}

	function clear(event: Event): void {
		setValue(multiple ? [] : null, event);
		setInputValue('', event);
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
		setHighlighted: (next) => {
			highlighted = next;
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

	const selectedSet = $derived(new Set(getSelectedValues()));
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
		<select
			{name}
			{form}
			multiple={multiple || undefined}
			required={required || undefined}
			value={multiple ? undefined : ((currentValue as string | null) ?? '')}
			tabindex="-1"
			aria-hidden="true"
			style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;"
		>
			{#if !multiple}
				<option value=""></option>
			{/if}
			{#each items as item (item.id)}
				<option value={item.value} selected={selectedSet.has(item.value)}>
					{item.label}
				</option>
			{/each}
			{#each collectionItems as item (item.value)}
				{#if !items.some((entry) => entry.value === item.value)}
					<option value={item.value} selected={selectedSet.has(item.value)}>
						{item.label}
					</option>
				{/if}
			{/each}
		</select>
	{/if}
</div>
