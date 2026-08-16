<script lang="ts">
	import { getContext } from 'svelte';
	import { SCROLL_AREA_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { ScrollAreaContext, ScrollAreaContentProps } from './types.js';

	let { class: className, style, children, ...rest }: ScrollAreaContentProps = $props();

	const ctx = getContext<ScrollAreaContext>(SCROLL_AREA_CONTEXT);

	const contentProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style,
			'data-scrolling': ctx.scrolling ? '' : undefined,
		}),
	);
</script>

<div {...contentProps}>
	{#if children}
		{@render children()}
	{/if}
</div>
