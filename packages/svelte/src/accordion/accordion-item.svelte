<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import { useId } from '../internal/controllable.svelte.js';
	import {
		ACCORDION_CONTEXT,
		ACCORDION_ITEM_CONTEXT
	} from '../internal/context-keys.js';
	import { createPresence } from '../internal/presence.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type {
		AccordionContext,
		AccordionItemContext,
		AccordionItemProps
	} from './types.js';

	let {
		value = useId('accordion-item'),
		disabled = false,
		class: className,
		style,
		id,
		children,
		...rest
	}: AccordionItemProps = $props();

	const root = getContext<AccordionContext>(ACCORDION_CONTEXT);

	const itemDisabled = $derived(disabled || root.disabled);
	const open = $derived(root.isOpen(value));
	const presence = createPresence(() => open);
	const triggerId = $derived(root.getTriggerId(value));
	const panelId = $derived(root.getPanelId(value));

	setContext(ACCORDION_ITEM_CONTEXT, {
		get value() {
			return value;
		},
		get open() {
			return open;
		},
		get disabled() {
			return itemDisabled;
		},
		get triggerId() {
			return triggerId;
		},
		get panelId() {
			return panelId;
		},
		presence
	} satisfies AccordionItemContext);

	const itemProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			class: className,
			style,
			'data-open': open ? '' : undefined,
			'data-closed': !open ? '' : undefined,
			'data-disabled': itemDisabled ? '' : undefined
		})
	);
</script>

<div
	{...itemProps}
	style={typeof itemProps.style === 'string' ? itemProps.style : undefined}
	{@attach () => root.registerItem(value)}
>
	{#if children}
		{@render children({ open, disabled: itemDisabled })}
	{/if}
</div>
