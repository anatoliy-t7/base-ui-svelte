<script lang="ts">
	import { setContext } from 'svelte';
	import { SCROLL_AREA_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import { ScrollAreaState } from './scroll-area-state.svelte.js';
	import type { ScrollAreaContext, ScrollAreaRootProps } from './types.js';

	let {
		overflowEdgeThreshold = 0,
		class: className,
		style,
		id,
		children,
		...rest
	}: ScrollAreaRootProps = $props();

	const state = new ScrollAreaState();

	function thresholdFor(side: 'top' | 'right' | 'bottom' | 'left'): number {
		if (typeof overflowEdgeThreshold === 'number') return overflowEdgeThreshold;
		return overflowEdgeThreshold?.[side] ?? 0;
	}

	const overflow = $derived.by(() => {
		const m = state.metrics;
		const top = m.scrollTop > thresholdFor('top');
		const bottom = m.scrollTop + m.clientHeight < m.scrollHeight - thresholdFor('bottom');
		const left = m.scrollLeft > thresholdFor('left');
		const right = m.scrollLeft + m.clientWidth < m.scrollWidth - thresholdFor('right');
		return { top, right, bottom, left, x: left || right, y: top || bottom };
	});

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
		markScrolling: () => state.markScrolling(),
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
			'data-scrolling': state.scrolling ? '' : undefined,
			'data-overflow-x': overflow.x ? '' : undefined,
			'data-overflow-y': overflow.y ? '' : undefined,
			'data-overflow-top': overflow.top ? '' : undefined,
			'data-overflow-right': overflow.right ? '' : undefined,
			'data-overflow-bottom': overflow.bottom ? '' : undefined,
			'data-overflow-left': overflow.left ? '' : undefined,
		}),
	);
</script>

<div {...rootProps}>
	{#if children}
		{@render children()}
	{/if}
</div>
