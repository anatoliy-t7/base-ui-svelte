<script lang="ts">
	import { getContext } from 'svelte';
	import { POPOVER_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { PopoverContext, PopoverTitleProps } from './types.js';

	let { class: className, style, children, ...rest }: PopoverTitleProps = $props();

	const ctx = getContext<PopoverContext>(POPOVER_CONTEXT);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id: ctx.titleId,
			class: className,
			style,
		}),
	);
</script>

<h2 {...mergedProps} style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}>
	{#if children}
		{@render children()}
	{/if}
</h2>
