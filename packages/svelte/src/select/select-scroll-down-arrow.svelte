<script lang="ts">
	import { getContext } from 'svelte';
	import { SELECT_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { SelectContext, SelectScrollDownArrowProps } from './types.js';

	let { class: className, style, children, ...rest }: SelectScrollDownArrowProps = $props();

	const ctx = getContext<SelectContext>(SELECT_CONTEXT);

	let canScroll = $state(false);

	function updateCanScroll(): void {
		const list = ctx.refs.list;
		if (!list) {
			canScroll = false;
			return;
		}
		canScroll = Math.ceil(list.scrollTop + list.clientHeight) < list.scrollHeight;
	}

	$effect(() => {
		if (!ctx.open || !ctx.presence.isPresent) {
			canScroll = false;
			return;
		}

		let disposed = false;
		let frame = 0;
		let list: HTMLElement | null = null;
		let observer: ResizeObserver | null = null;

		function attach(): void {
			if (disposed) return;
			list = ctx.refs.list;
			if (!list) {
				frame = requestAnimationFrame(attach);
				return;
			}
			updateCanScroll();
			list.addEventListener('scroll', updateCanScroll, { passive: true });
			observer = new ResizeObserver(updateCanScroll);
			observer.observe(list);
		}

		attach();

		return () => {
			disposed = true;
			cancelAnimationFrame(frame);
			list?.removeEventListener('scroll', updateCanScroll);
			observer?.disconnect();
		};
	});

	function scrollDown(): void {
		const list = ctx.refs.list;
		if (!list) return;
		list.scrollBy({ top: list.clientHeight, behavior: 'smooth' });
	}

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			type: 'button',
			class: className,
			style,
			tabindex: -1,
			'aria-hidden': 'true',
			'data-direction': 'down',
			'data-hidden': !canScroll ? '' : undefined,
			hidden: !canScroll ? true : undefined,
			onclick: (event: MouseEvent) => {
				event.preventDefault();
				scrollDown();
			},
		}),
	);
</script>

<button
	{...mergedProps}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
>
	{#if children}
		{@render children()}
	{:else}
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			aria-hidden="true"
			style="display: block;"
		>
			<path
				d="M3.5 6.5 8 11l4.5-4.5"
				fill="none"
				stroke="currentColor"
				stroke-width="1.75"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{/if}
</button>
