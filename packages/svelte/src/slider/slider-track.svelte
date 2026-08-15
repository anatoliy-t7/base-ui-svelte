<script lang="ts">
	import { getContext } from 'svelte';
	import { SLIDER_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { SliderContext, SliderTrackProps } from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: SliderTrackProps = $props();

	const ctx = getContext<SliderContext>(SLIDER_CONTEXT);

	const trackProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style,
			'data-disabled': ctx.disabled ? '' : undefined,
			'data-orientation': ctx.orientation
		})
	);
</script>

<div {...trackProps}>
	{#if children}
		{@render children()}
	{/if}
</div>
