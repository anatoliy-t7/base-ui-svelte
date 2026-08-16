<script lang="ts">
	import { getContext } from 'svelte';
	import { DRAWER_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { DrawerContext, DrawerSwipeAreaProps, DrawerSwipeDirection } from './types.js';

	let {
		render = 'div',
		disabled = false,
		swipeDirection: swipeDirectionProp,
		class: className,
		style,
		children,
		...rest
	}: DrawerSwipeAreaProps = $props();

	const ctx = getContext<DrawerContext>(DRAWER_CONTEXT);

	const opposite: Record<DrawerSwipeDirection, DrawerSwipeDirection> = {
		up: 'down',
		down: 'up',
		left: 'right',
		right: 'left',
	};

	const openDirection = $derived(swipeDirectionProp ?? opposite[ctx.swipeDirection]);

	function edgeStyle(direction: DrawerSwipeDirection): string {
		const thickness = '24px';
		switch (direction) {
			case 'up':
				return `position:fixed;left:0;right:0;bottom:0;height:${thickness};`;
			case 'down':
				return `position:fixed;left:0;right:0;top:0;height:${thickness};`;
			case 'left':
				return `position:fixed;top:0;bottom:0;right:0;width:${thickness};`;
			case 'right':
				return `position:fixed;top:0;bottom:0;left:0;width:${thickness};`;
		}
	}

	const enabled = $derived(!disabled && !ctx.open);

	let activePointerId: number | null = null;

	function estimateSize(): number {
		if (ctx.refs.popup) {
			const rect = ctx.refs.popup.getBoundingClientRect();
			return Math.max(
				ctx.swipeDirection === 'left' || ctx.swipeDirection === 'right' ? rect.width : rect.height,
				1,
			);
		}
		if (typeof window === 'undefined') return 1;
		return Math.max(
			ctx.swipeDirection === 'left' || ctx.swipeDirection === 'right'
				? window.innerWidth
				: window.innerHeight,
			1,
		);
	}

	function handlePointerDown(event: PointerEvent): void {
		if (!enabled || event.button !== 0) return;
		event.preventDefault();
		activePointerId = event.pointerId;
		const target = event.currentTarget;
		if (target instanceof HTMLElement) {
			target.setPointerCapture(event.pointerId);
		}
		ctx.beginSwipe(event.pointerId, event.clientX, event.clientY, 'open');
	}

	function handlePointerMove(event: PointerEvent): void {
		if (activePointerId === null || event.pointerId !== activePointerId) return;
		if (ctx.swipeMode !== 'open') return;
		ctx.updateSwipe(event.clientX, event.clientY, event.timeStamp, estimateSize());
	}

	function handlePointerUp(event: PointerEvent): void {
		if (activePointerId === null || event.pointerId !== activePointerId) return;
		activePointerId = null;
		if (ctx.swipeMode !== 'open') return;
		ctx.endSwipe(estimateSize());
	}

	function handlePointerCancel(event: PointerEvent): void {
		if (activePointerId === null || event.pointerId !== activePointerId) return;
		activePointerId = null;
		ctx.cancelSwipe();
		if (ctx.open) {
			ctx.setOpen(false, 'imperative-action');
		}
	}

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style: [edgeStyle(openDirection), typeof style === 'string' ? style : undefined]
				.filter(Boolean)
				.join(';'),
			role: 'presentation',
			'aria-hidden': 'true',
			'data-swipe-direction': openDirection,
			'data-open': ctx.open ? '' : undefined,
			'data-closed': !ctx.open ? '' : undefined,
			'data-disabled': disabled ? '' : undefined,
			'data-swiping': ctx.swiping && ctx.swipeMode === 'open' ? '' : undefined,
			onpointerdown: handlePointerDown,
			onpointermove: handlePointerMove,
			onpointerup: handlePointerUp,
			onpointercancel: handlePointerCancel,
		}),
	);
</script>

{#if enabled || (ctx.swiping && ctx.swipeMode === 'open')}
	<svelte:element
		this={render}
		{...mergedProps}
		style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
	>
		{#if children}
			{@render children()}
		{/if}
	</svelte:element>
{/if}
