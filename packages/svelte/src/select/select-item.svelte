<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import { SELECT_CONTEXT, SELECT_ITEM_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { SelectContext, SelectItemContext, SelectItemProps } from './types.js';

	let {
		value,
		disabled = false,
		class: className,
		style,
		children,
		...rest
	}: SelectItemProps = $props();

	const ctx = getContext<SelectContext>(SELECT_CONTEXT);

	const itemId = $derived(ctx.getItemId(value));
	const selected = $derived(ctx.value === value);
	const highlighted = $derived(ctx.highlighted === value);
	const isDisabled = $derived(Boolean(disabled || ctx.disabled));

	function setLabel(label: string): void {
		ctx.setItemLabel(value, label);
	}

	setContext(SELECT_ITEM_CONTEXT, {
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
		},
		setLabel
	} satisfies SelectItemContext);

	function select(event: Event): void {
		if (isDisabled) return;
		ctx.setValue(value, event);
		ctx.setOpen(false, 'imperative-action');
	}

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id: itemId,
			role: 'option',
			class: className,
			style,
			tabindex: -1,
			'aria-selected': selected,
			'aria-disabled': isDisabled || undefined,
			'data-selected': selected ? '' : undefined,
			'data-highlighted': highlighted ? '' : undefined,
			'data-disabled': isDisabled ? '' : undefined,
			onclick: (event: MouseEvent) => {
				select(event);
			},
			onpointermove: () => {
				if (isDisabled) return;
				ctx.setHighlighted(value);
			}
		})
	);
</script>

<div
	{...mergedProps}
	{@attach (element) => {
		const cleanup = ctx.registerItem(itemId, value, element);
		queueMicrotask(() => {
			if (!element.querySelector('[data-select-item-text]')) {
				const text = element.textContent?.trim() ?? value;
				ctx.setItemLabel(value, text);
			}
		});
		return cleanup;
	}}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
>
	{#if children}
		{@render children({ selected, highlighted, disabled: isDisabled })}
	{/if}
</div>
