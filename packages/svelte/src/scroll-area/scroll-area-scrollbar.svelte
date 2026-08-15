<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import { SCROLL_AREA_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import { SCROLLBAR_CONTEXT } from './scrollbar-context.js';
	import type { ScrollAreaContext, ScrollAreaScrollbarProps, ScrollbarContext } from './types.js';

	let {
		orientation = 'vertical',
		class: className,
		style,
		children,
		...rest
	}: ScrollAreaScrollbarProps = $props();

	const ctx = getContext<ScrollAreaContext>(SCROLL_AREA_CONTEXT);

	setContext(SCROLLBAR_CONTEXT, {
		get orientation() {
			return orientation;
		}
	} satisfies ScrollbarContext);

	let trackEl: HTMLDivElement | undefined = $state();

	function onPointerDown(event: PointerEvent): void {
		if (event.button !== 0 || !trackEl) return;
		const target = event.target;
		if (!(target instanceof Element)) return;
		if (target.closest('[data-slot="scroll-area-thumb"]')) return;

		const rect = trackEl.getBoundingClientRect();
		const { metrics } = ctx;

		if (orientation === 'vertical') {
			const clickRatio = rect.height === 0 ? 0 : (event.clientY - rect.top) / rect.height;
			const maxScroll = Math.max(0, metrics.scrollHeight - metrics.clientHeight);
			ctx.scrollTo({ top: clickRatio * maxScroll });
		} else {
			const clickRatio = rect.width === 0 ? 0 : (event.clientX - rect.left) / rect.width;
			const maxScroll = Math.max(0, metrics.scrollWidth - metrics.clientWidth);
			ctx.scrollTo({ left: clickRatio * maxScroll });
		}
	}

	const scrollbarStyle = $derived.by(() => {
		const parts = ['position:relative', 'touch-action:none'];
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

	const scrollbarProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style: scrollbarStyle,
			'data-orientation': orientation,
			'data-scrolling': ctx.scrolling ? '' : undefined,
			onpointerdown: onPointerDown
		})
	);
</script>

<div bind:this={trackEl} {...scrollbarProps}>
	{#if children}
		{@render children()}
	{/if}
</div>
