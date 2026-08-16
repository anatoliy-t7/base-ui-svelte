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
		disabled = false,
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

	function isSelected(itemValue: string): boolean {
		return getSelectedValues().includes(itemValue);
	}

	function getLabelForValue(itemValue: string): string {
		const registered = registeredItems.find((item) => item.value === itemValue);
		if (registered?.label && registered.label !== itemValue) return registered.label;
		if (labelCache[itemValue]) return labelCache[itemValue];
		const collection = collectionItems.find((item) => item.value === itemValue);
		if (collection) return collection.label;
		return registered?.label ?? itemValue;
	}

	function setValue(next: SelectValue, event: Event): void {
		if (disabled) return;
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
			const selected = getSelectedValues();
			const firstSelected = selected[0];
			highlighted =
				(firstSelected != null
					? registeredItems.find((item) => item.value === firstSelected)?.value
					: undefined) ??
				registeredItems[0]?.value ??
				null;
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

	const selectedSet = $derived(new Set(getSelectedValues()));
</script>

<div {...rootProps} style={typeof rootProps.style === 'string' ? rootProps.style : undefined}>
	{#if children}
		{@render children({ value: currentValue, open: openState.open, disabled })}
	{/if}

	{#if name && !disabled}
		<select
			{name}
			multiple={multiple || undefined}
			value={multiple ? undefined : ((currentValue as string | null) ?? '')}
			tabindex="-1"
			aria-hidden="true"
			style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;"
		>
			{#if !multiple}
				<option value=""></option>
			{/if}
			{#each registeredItems as item (item.id)}
				<option value={item.value} selected={selectedSet.has(item.value)}>
					{item.label}
				</option>
			{/each}
			{#each collectionItems as item (item.value)}
				{#if !registeredItems.some((entry) => entry.value === item.value)}
					<option value={item.value} selected={selectedSet.has(item.value)}>
						{item.label}
					</option>
				{/if}
			{/each}
		</select>
	{/if}
</div>
