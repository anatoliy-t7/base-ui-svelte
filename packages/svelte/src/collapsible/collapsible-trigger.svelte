<script lang="ts">
	import { getContext } from 'svelte';
	import { COLLAPSIBLE_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { CollapsibleContext, CollapsibleTriggerProps } from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: CollapsibleTriggerProps = $props();

	const ctx = getContext<CollapsibleContext>(COLLAPSIBLE_CONTEXT);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id: ctx.triggerId,
			type: 'button',
			class: className,
			style,
			disabled: ctx.disabled || undefined,
			'aria-expanded': ctx.open,
			'aria-controls': ctx.panelId,
			'data-panel-open': ctx.open ? '' : undefined,
			'data-disabled': ctx.disabled ? '' : undefined,
			onclick: () => {
				if (ctx.disabled) return;
				ctx.setOpen(!ctx.open, 'trigger-press');
			}
		})
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
