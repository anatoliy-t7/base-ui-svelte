<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import { COMBOBOX_CONTEXT, COMBOBOX_ITEM_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type {
		ComboboxContext,
		ComboboxItemContext,
		ComboboxItemProps
	} from './types.js';

	let {
		value,
		label: labelProp,
		disabled = false,
		class: className,
		style,
		children,
		...rest
	}: ComboboxItemProps = $props();

	const ctx = getContext<ComboboxContext>(COMBOBOX_CONTEXT);

	const itemId = $derived(ctx.getItemId(value));
	const selected = $derived(ctx.isSelected(value));
	const highlighted = $derived(ctx.highlighted === value);
	const isDisabled = $derived(Boolean(disabled || ctx.disabled));
	const label = $derived(labelProp ?? value);
	const visible = $derived(ctx.isItemVisible(value));

	setContext(COMBOBOX_ITEM_CONTEXT, {
		get value() {
			return value;
		},
		get selected() {
			return selected;
		},
		get highlighted() {
			return highlighted;
		},
		get disabled() {
			return isDisabled;
		}
	} satisfies ComboboxItemContext);

	function select(event: Event): void {
		if (isDisabled) return;
		ctx.selectItem(value, label, event);
	}

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id: itemId,
			role: 'option',
			class: className,
			style,
			tabindex: -1,
			hidden: !visible ? true : undefined,
			'aria-selected': selected,
			'aria-disabled': isDisabled || undefined,
			'data-selected': selected ? '' : undefined,
			'data-highlighted': highlighted ? '' : undefined,
			'data-disabled': isDisabled ? '' : undefined,
			onclick: (event: MouseEvent) => {
				select(event);
			},
			onpointermove: () => {
				if (isDisabled || !visible) return;
				ctx.setHighlighted(value);
			}
		})
	);
</script>

<div
	{...mergedProps}
	{@attach (element) => ctx.registerItem(itemId, value, label, element)}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
>
	{#if children}
		{@render children({ selected, highlighted, disabled: isDisabled })}
	{:else}
		{label}
	{/if}
</div>
