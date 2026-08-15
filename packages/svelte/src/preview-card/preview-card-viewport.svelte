<script lang="ts">
	import { getContext } from 'svelte';
	import { PREVIEW_CARD_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { PreviewCardContext, PreviewCardViewportProps } from './types.js';

	let {
		render = 'div',
		class: className,
		style,
		children,
		...rest
	}: PreviewCardViewportProps = $props();

	const ctx = getContext<PreviewCardContext>(PREVIEW_CARD_CONTEXT);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style,
			'data-open': ctx.open ? '' : undefined,
			'data-closed': !ctx.open ? '' : undefined
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
