<script lang="ts">
	import { getContext } from 'svelte';
	import { CONTEXT_MENU_CONTEXT } from '../internal/context-keys.js';
	import { createPositioner, type VirtualElement } from '../internal/floating.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { ContextMenuContext, ContextMenuPositionerProps } from './types.js';

	let {
		side = 'bottom',
		align = 'start',
		sideOffset = 8,
		class: className,
		style,
		children,
		...rest
	}: ContextMenuPositionerProps = $props();

	const ctx = getContext<ContextMenuContext>(CONTEXT_MENU_CONTEXT);

	let positionerEl = $state<HTMLElement | null>(null);

	$effect(() => {
		ctx.refs.positioner = positionerEl;
		return () => {
			if (ctx.refs.positioner === positionerEl) {
				ctx.refs.positioner = null;
			}
		};
	});

	createPositioner({
		get open() {
			return ctx.open;
		},
		anchor: () => {
			if (ctx.isSubmenu) {
				return ctx.refs.trigger;
			}
			const point = ctx.anchorPoint;
			if (!point) return null;
			const x = point.x;
			const y = point.y;
			const virtual: VirtualElement = {
				getBoundingClientRect() {
					return new DOMRect(x, y, 0, 0);
				},
			};
			return virtual;
		},
		floating: () => ctx.refs.positioner,
		arrowEl: () => ctx.refs.arrow,
		get side() {
			return side;
		},
		get align() {
			return align;
		},
		get sideOffset() {
			return sideOffset;
		},
		// Match Base UI: context menus (pointer / virtual anchors) use fixed.
		strategy: 'fixed',
	});

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style: ['position:fixed;left:0;top:0', typeof style === 'string' ? style : undefined]
				.filter(Boolean)
				.join(';'),
			'data-open': ctx.open ? '' : undefined,
			'data-closed': !ctx.open ? '' : undefined,
		}),
	);
</script>

{#if ctx.presence.isPresent}
	<div
		{...mergedProps}
		bind:this={positionerEl}
		style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
	>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
