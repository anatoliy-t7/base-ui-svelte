<script lang="ts">
	import { setContext } from 'svelte';
	import {
		createControllableOpen,
		useId
	} from '../internal/controllable.svelte.js';
	import { AUTOCOMPLETE_CONTEXT } from '../internal/context-keys.js';
	import { createPresence } from '../internal/presence.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type {
		AutocompleteContext,
		AutocompleteItemEntry,
		AutocompleteRefs,
		AutocompleteRootProps
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
		disabled = false,
		filter = true,
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
		}
	});

	let uncontrolledValue = $state<string | null | undefined>(undefined);
	let uncontrolledInput = $state<string | undefined>(undefined);
	let items = $state<AutocompleteItemEntry[]>([]);
	let highlighted = $state<string | null>(null);

	const isValueControlled = $derived(value !== undefined);
	const currentValue = $derived(value !== undefined ? value : (uncontrolledValue ?? defaultValue));

	const isInputControlled = $derived(inputValue !== undefined);
	const currentInputValue = $derived(
		inputValue !== undefined ? inputValue : (uncontrolledInput ?? defaultInputValue)
	);

	const presence = createPresence(() => openState.open);

	const refs: AutocompleteRefs = {
		input: null,
		trigger: null,
		popup: null,
		positioner: null,
		list: null,
		arrow: null
	};

	const inputId = useId('autocomplete-input');
	const listId = useId('autocomplete-list');
	let labelId = $state<string | undefined>(undefined);

	function setValue(next: string | null, event: Event): void {
		if (disabled) return;
		if (isValueControlled) {
			value = next;
		} else {
			uncontrolledValue = next;
		}
		onValueChange?.(next, event);
	}

	function setInputValue(next: string, event?: Event): void {
		if (disabled) return;
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
		element: HTMLElement
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

	function getVisibleItems(): AutocompleteItemEntry[] {
		return items.filter((item) => matchesFilter(item.label));
	}

	function isItemVisible(itemValue: string): boolean {
		const entry = items.find((item) => item.value === itemValue);
		if (!entry) return true;
		return matchesFilter(entry.label);
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
		setHighlighted: (next) => {
			highlighted = next;
		},
		get items() {
			return items;
		},
		getVisibleItems,
		isItemVisible,
		getItemId,
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
		get filter() {
			return filter;
		},
		selectItem
	} satisfies AutocompleteContext);

	const rootProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			class: className,
			style,
			'data-open': openState.open ? '' : undefined,
			'data-closed': !openState.open ? '' : undefined,
			'data-disabled': disabled ? '' : undefined
		})
	);
</script>

<div {...rootProps} style={typeof rootProps.style === 'string' ? rootProps.style : undefined}>
	{#if children}
		{@render children({
			value: currentValue,
			inputValue: currentInputValue,
			open: openState.open,
			disabled
		})}
	{/if}
</div>
