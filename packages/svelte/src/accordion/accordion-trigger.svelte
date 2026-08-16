<script lang="ts">
	import { getContext } from 'svelte';
	import { ACCORDION_CONTEXT, ACCORDION_ITEM_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { AccordionContext, AccordionItemContext, AccordionTriggerProps } from './types.js';

	let { class: className, style, children, ...rest }: AccordionTriggerProps = $props();

	const root = getContext<AccordionContext>(ACCORDION_CONTEXT);
	const item = getContext<AccordionItemContext>(ACCORDION_ITEM_CONTEXT);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id: item.triggerId,
			type: 'button',
			class: className,
			style,
			disabled: item.disabled || undefined,
			'aria-expanded': item.open,
			'aria-controls': item.panelId,
			'data-panel-open': item.open ? '' : undefined,
			'data-disabled': item.disabled ? '' : undefined,
			onclick: () => {
				if (item.disabled) return;
				root.toggle(item.value);
			},
		}),
	);
</script>

<button
	{...mergedProps}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
>
	{#if children}
		{@render children()}
	{/if}
</button>
