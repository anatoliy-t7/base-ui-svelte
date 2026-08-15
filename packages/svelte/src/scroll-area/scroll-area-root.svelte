<script lang="ts">
	import { setContext } from 'svelte';
	import { SCROLL_AREA_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import { ScrollAreaState } from './scroll-area-state.svelte.js';
	import type { ScrollAreaContext, ScrollAreaRootProps } from './types.js';

	let {
		class: className,
		style,
		id,
		children,
		...rest
	}: ScrollAreaRootProps = $props();

	const state = new ScrollAreaState();

	setContext(SCROLL_AREA_CONTEXT, {
		get viewport() {
			return state.viewport;
		},
		get metrics() {
			return state.metrics;
		},
		get scrolling() {
			return state.scrolling;
		},
		setViewport: (node) => state.setViewport(node),
		scrollTo: (options) => state.scrollTo(options),
		refreshMetrics: () => state.refreshMetrics(),
		markScrolling: () => state.markScrolling()
	} satisfies ScrollAreaContext);

	const rootStyle = $derived.by(() => {
		const parts = ['position:relative'];
		if (typeof style === 'string' && style.length > 0) {
			parts.push(style);
		} else if (typeof style === 'object' && style !== null) {
			for (const [key, value] of Object.entries(style)) {
				if (value != null && value !== '') {
					parts.push(`${key}:${value}`);
				}
			}
		}
		return parts.join(';');
	});

	const rootProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			class: className,
			style: rootStyle,
			'data-scrolling': state.scrolling ? '' : undefined
		})
	);
</script>

<div {...rootProps}>
	{#if children}
		{@render children()}
	{/if}
</div>
