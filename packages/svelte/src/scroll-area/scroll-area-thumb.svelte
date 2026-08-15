<script lang="ts">
	import { getContext } from 'svelte';
	import { SCROLL_AREA_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import { SCROLLBAR_CONTEXT } from './scrollbar-context.js';
	import type { ScrollAreaContext, ScrollAreaThumbProps, ScrollbarContext } from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: ScrollAreaThumbProps = $props();

	const ctx = getContext<ScrollAreaContext>(SCROLL_AREA_CONTEXT);
	const scrollbar = getContext<ScrollbarContext>(SCROLLBAR_CONTEXT);

	let dragging = $state(false);
	let dragStartPointer = $state(0);
	let dragStartScroll = $state(0);

	const sizePercent = $derived.by(() => {
		const { metrics } = ctx;
		if (scrollbar.orientation === 'vertical') {
			if (metrics.scrollHeight <= 0) return 100;
			return Math.min(100, Math.max(10, (metrics.clientHeight / metrics.scrollHeight) * 100));
		}
		if (metrics.scrollWidth <= 0) return 100;
		return Math.min(100, Math.max(10, (metrics.clientWidth / metrics.scrollWidth) * 100));
	});

	const offsetPercent = $derived.by(() => {
		const { metrics } = ctx;
		if (scrollbar.orientation === 'vertical') {
			const maxScroll = Math.max(0, metrics.scrollHeight - metrics.clientHeight);
			if (maxScroll === 0) return 0;
			return (metrics.scrollTop / maxScroll) * (100 - sizePercent);
		}
		const maxScroll = Math.max(0, metrics.scrollWidth - metrics.clientWidth);
		if (maxScroll === 0) return 0;
		return (metrics.scrollLeft / maxScroll) * (100 - sizePercent);
	});

	function onPointerDown(event: PointerEvent): void {
		if (event.button !== 0) return;
		event.stopPropagation();
		const target = event.currentTarget;
		if (!(target instanceof HTMLElement)) return;
		target.setPointerCapture(event.pointerId);
		dragging = true;
		if (scrollbar.orientation === 'vertical') {
			dragStartPointer = event.clientY;
			dragStartScroll = ctx.metrics.scrollTop;
		} else {
			dragStartPointer = event.clientX;
			dragStartScroll = ctx.metrics.scrollLeft;
		}
	}

	function onPointerMove(event: PointerEvent): void {
		if (!dragging) return;
		const { metrics } = ctx;
		if (scrollbar.orientation === 'vertical') {
			const trackSize = metrics.clientHeight;
			const maxScroll = Math.max(0, metrics.scrollHeight - metrics.clientHeight);
			const thumbTravel = trackSize * ((100 - sizePercent) / 100);
			if (thumbTravel <= 0) return;
			const delta = event.clientY - dragStartPointer;
			const next = dragStartScroll + (delta / thumbTravel) * maxScroll;
			ctx.scrollTo({ top: Math.min(maxScroll, Math.max(0, next)) });
		} else {
			const trackSize = metrics.clientWidth;
			const maxScroll = Math.max(0, metrics.scrollWidth - metrics.clientWidth);
			const thumbTravel = trackSize * ((100 - sizePercent) / 100);
			if (thumbTravel <= 0) return;
			const delta = event.clientX - dragStartPointer;
			const next = dragStartScroll + (delta / thumbTravel) * maxScroll;
			ctx.scrollTo({ left: Math.min(maxScroll, Math.max(0, next)) });
		}
	}

	function onPointerUp(event: PointerEvent): void {
		if (!dragging) return;
		dragging = false;
		const target = event.currentTarget;
		if (!(target instanceof HTMLElement)) return;
		if (target.hasPointerCapture(event.pointerId)) {
			target.releasePointerCapture(event.pointerId);
		}
	}

	const thumbStyle = $derived.by(() => {
		const parts =
			scrollbar.orientation === 'vertical'
				? [
						'position:absolute',
						`height:${sizePercent}%`,
						`top:${offsetPercent}%`,
						'left:0',
						'right:0'
					]
				: [
						'position:absolute',
						`width:${sizePercent}%`,
						`left:${offsetPercent}%`,
						'top:0',
						'bottom:0'
					];
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

	const thumbProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style: thumbStyle,
			'data-slot': 'scroll-area-thumb',
			'data-orientation': scrollbar.orientation,
			'data-scrolling': ctx.scrolling ? '' : undefined,
			onpointerdown: onPointerDown,
			onpointermove: onPointerMove,
			onpointerup: onPointerUp,
			onpointercancel: onPointerUp
		})
	);
</script>

<div {...thumbProps}>
	{#if children}
		{@render children()}
	{/if}
</div>
