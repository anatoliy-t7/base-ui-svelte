<script lang="ts">
	import { setContext } from 'svelte';
	import {
		createControllableOpen,
		useId
	} from '../internal/controllable.svelte.js';
	import { SELECT_CONTEXT } from '../internal/context-keys.js';
	import { createPresence } from '../internal/presence.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type {
		SelectContext,
		SelectItemEntry,
		SelectRefs,
		SelectRootProps
	} from './types.js';

	let {
		value = $bindable(undefined),
		defaultValue = null,
		onValueChange,
		open = $bindable(undefined),
		defaultOpen = false,
		onOpenChange,
		disabled = false,
		name,
		class: className,
		style,
		id = useId('select'),
		children,
		...rest
	}: SelectRootProps = $props();

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
	let items = $state<SelectItemEntry[]>([]);
	let highlighted = $state<string | null>(null);
	let selectedLabel = $state<string | null>(null);

	const isValueControlled = $derived(value !== undefined);
	const currentValue = $derived(value !== undefined ? value : (uncontrolledValue ?? defaultValue));

	const presence = createPresence(() => openState.open);

	const refs: SelectRefs = {
		trigger: null,
		popup: null,
		positioner: null,
		list: null,
		arrow: null
	};

	const triggerId = useId('select-trigger');
	const listId = useId('select-list');
	let labelId = $state<string | undefined>(undefined);

	function setValue(next: string | null, event: Event): void {
		if (disabled) return;
		if (next == null) {
			selectedLabel = null;
		} else {
			selectedLabel = items.find((item) => item.value === next)?.label ?? next;
		}
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
			const selected = items.find((item) => item.value === currentValue);
			highlighted = selected?.value ?? items[0]?.value ?? null;
		} else {
			highlighted = null;
		}
	}

	function registerItem(itemId: string, itemValue: string, element: HTMLElement): () => void {
		queueMicrotask(() => {
			if (items.some((item) => item.id === itemId)) return;
			items.push({ id: itemId, value: itemValue, label: itemValue, element });
		});
		return () => {
			items = items.filter((item) => item.id !== itemId);
		};
	}

	function setItemLabel(itemValue: string, label: string): void {
		const entry = items.find((item) => item.value === itemValue);
		if (entry) {
			entry.label = label;
		}
		if (itemValue === currentValue) {
			selectedLabel = label;
		}
	}

	function getItemId(itemValue: string): string {
		return `${listId}-option-${itemValue}`;
	}

	function getVisibleItems(): SelectItemEntry[] {
		return items;
	}

	function getSelectedLabel(): string | null {
		if (currentValue == null) return null;
		return items.find((item) => item.value === currentValue)?.label ?? selectedLabel ?? currentValue;
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
			return items;
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
		getSelectedLabel
	} satisfies SelectContext);

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
		{@render children({ value: currentValue, open: openState.open, disabled })}
	{/if}

	{#if name && !disabled}
		<select
			{name}
			value={currentValue ?? ''}
			tabindex="-1"
			aria-hidden="true"
			style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;"
		>
			<option value=""></option>
			{#each items as item (item.id)}
				<option value={item.value} selected={item.value === currentValue}>
					{item.label}
				</option>
			{/each}
		</select>
	{/if}
</div>
