<script lang="ts">
	import { getContext } from 'svelte';
	import { CONTEXT_MENU_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { ContextMenuContext, ContextMenuTriggerProps } from './types.js';

	const LONG_PRESS_MS = 500;

	let {
		render = 'div',
		disabled = false,
		class: className,
		style,
		children,
		...rest
	}: ContextMenuTriggerProps = $props();

	const ctx = getContext<ContextMenuContext>(CONTEXT_MENU_CONTEXT);

	let triggerEl = $state<HTMLElement | null>(null);
	let longPressTimer: ReturnType<typeof setTimeout> | null = null;
	let longPressPoint: { x: number; y: number } | null = null;

	function clearLongPress(): void {
		if (longPressTimer != null) {
			clearTimeout(longPressTimer);
			longPressTimer = null;
		}
		longPressPoint = null;
	}

	$effect(() => {
		ctx.refs.trigger = triggerEl;
		return () => {
			if (ctx.refs.trigger === triggerEl) {
				ctx.refs.trigger = null;
			}
			clearLongPress();
		};
	});

	function openAt(x: number, y: number): void {
		if (disabled) return;
		ctx.setAnchorPoint({ x, y });
		ctx.setOpen(true, 'trigger-press');
	}

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id: ctx.triggerId,
			class: className,
			style,
			'data-open': ctx.open ? '' : undefined,
			'data-closed': !ctx.open ? '' : undefined,
			'data-disabled': disabled ? '' : undefined,
			oncontextmenu: (event: MouseEvent) => {
				if (disabled) return;
				event.preventDefault();
				openAt(event.clientX, event.clientY);
			},
			ontouchstart: (event: TouchEvent) => {
				if (disabled) return;
				const touch = event.touches[0];
				if (!touch) return;
				clearLongPress();
				longPressPoint = { x: touch.clientX, y: touch.clientY };
				longPressTimer = setTimeout(() => {
					if (longPressPoint) {
						openAt(longPressPoint.x, longPressPoint.y);
					}
					clearLongPress();
				}, LONG_PRESS_MS);
			},
			ontouchend: () => {
				clearLongPress();
			},
			ontouchmove: () => {
				clearLongPress();
			},
			ontouchcancel: () => {
				clearLongPress();
			}
		})
	);
</script>

<svelte:element
	this={render}
	{...mergedProps}
	bind:this={triggerEl}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
>
	{#if children}
		{@render children()}
	{/if}
</svelte:element>
