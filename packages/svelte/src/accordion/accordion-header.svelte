<script lang="ts">
	import { mergeProps } from '../internal/merge-props.js';
	import type { AccordionHeaderProps } from './types.js';

	let {
		render = 'h3',
		class: className,
		style,
		children,
		...rest
	}: AccordionHeaderProps = $props();

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style
		})
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
