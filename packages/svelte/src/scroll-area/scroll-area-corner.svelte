<script lang="ts">
	import { getContext } from 'svelte';
	import { SCROLL_AREA_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { ScrollAreaContext, ScrollAreaCornerProps } from './types.js';

	let { class: className, style, children, ...rest }: ScrollAreaCornerProps = $props();

	const ctx = getContext<ScrollAreaContext>(SCROLL_AREA_CONTEXT);

	const cornerProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style,
			'data-scrolling': ctx.scrolling ? '' : undefined,
			'aria-hidden': 'true',
			onpointerdown: (event: PointerEvent) => {
				if (event.button === 0) {
					event.preventDefault();
				}
			},
		}),
	);
</script>

<div {...cornerProps}>
	{#if children}
		{@render children()}
	{/if}
</div>
