<script lang="ts">
	import { getContext } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { SCROLL_AREA_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { ScrollAreaContext, ScrollAreaViewportProps } from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: ScrollAreaViewportProps = $props();

	const ctx = getContext<ScrollAreaContext>(SCROLL_AREA_CONTEXT);

	const attachViewport: Attachment = (element) => {
		ctx.setViewport(element as HTMLElement);

		let resizeObserver: ResizeObserver | undefined;
		if (typeof ResizeObserver !== 'undefined') {
			resizeObserver = new ResizeObserver(() => {
				ctx.refreshMetrics();
			});
			resizeObserver.observe(element);
			for (const child of element.children) {
				resizeObserver.observe(child);
			}
		}

		queueMicrotask(() => {
			ctx.refreshMetrics();
		});

		return () => {
			resizeObserver?.disconnect();
			ctx.setViewport(null);
			queueMicrotask(() => {
				ctx.refreshMetrics();
			});
		};
	};

	function onScroll(): void {
		ctx.refreshMetrics();
		ctx.markScrolling();
	}

	const viewportStyle = $derived.by(() => {
		const parts = [
			'overflow:auto',
			'scrollbar-width:none',
			'-ms-overflow-style:none'
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

	const viewportProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style: viewportStyle,
			'data-scrolling': ctx.scrolling ? '' : undefined,
			onscroll: onScroll
		})
	);
</script>

<div {...viewportProps} {@attach attachViewport}>
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	div::-webkit-scrollbar {
		display: none;
	}
</style>
