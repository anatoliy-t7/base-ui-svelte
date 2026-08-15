<script lang="ts">
	import { getContext } from 'svelte';
	import { SLIDER_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { SliderContext, SliderValueProps } from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: SliderValueProps = $props();

	const ctx = getContext<SliderContext>(SLIDER_CONTEXT);

	const displayValue = $derived(ctx.range ? ctx.values : ctx.value);

	const valueProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style,
			'data-disabled': ctx.disabled ? '' : undefined
		})
	);
</script>

<span {...valueProps}>
	{#if children}
		{@render children(ctx.formattedValue, displayValue)}
	{:else}
		{ctx.formattedValue}
	{/if}
</span>
