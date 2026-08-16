<script lang="ts">
	import { getContext } from 'svelte';
	import { TOOLTIP_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { TooltipContext, TooltipViewportProps } from './types.js';

	let {
		render = 'div',
		class: className,
		style,
		children,
		...rest
	}: TooltipViewportProps = $props();

	const ctx = getContext<TooltipContext>(TOOLTIP_CONTEXT);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style,
			'data-open': ctx.open ? '' : undefined,
			'data-closed': !ctx.open ? '' : undefined,
		}),
	);
</script>

<svelte:element
	this={render}
	{...mergedProps}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
>
	{#if children}
		{@render children()}
	{/if}
</svelte:element>
