<script lang="ts">
	import { getContext } from 'svelte';
	import { SLIDER_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { SliderContext, SliderLabelProps } from './types.js';

	let { class: className, style, id, children, ...rest }: SliderLabelProps = $props();

	const ctx = getContext<SliderContext>(SLIDER_CONTEXT);

	const labelProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id: id ?? ctx.labelId,
			class: className,
			style,
			'data-disabled': ctx.disabled ? '' : undefined,
		}),
	);
</script>

<span {...labelProps}>
	{#if children}
		{@render children()}
	{/if}
</span>
