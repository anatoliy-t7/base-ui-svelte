<script lang="ts">
	import { getContext } from 'svelte';
	import { DRAWER_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type {
		DrawerContext,
		DrawerSwipeAreaProps,
		DrawerSwipeDirection
	} from './types.js';

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
		right: 'left'
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

	function handlePointerDown(event: PointerEvent): void {
		if (!enabled) return;
		event.preventDefault();
		ctx.setOpen(true, 'trigger-press');
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
			'data-disabled': disabled ? '' : undefined
		})
	);
</script>

{#if enabled}
	<svelte:element
		this={render}
		{...mergedProps}
		style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
		onpointerdown={handlePointerDown}
	>
		{#if children}
			{@render children()}
		{/if}
	</svelte:element>
{/if}
