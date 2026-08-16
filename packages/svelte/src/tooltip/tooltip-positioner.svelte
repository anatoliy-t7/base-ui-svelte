<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import { TOOLTIP_CONTEXT, TOOLTIP_POSITIONER_CONTEXT } from '../internal/context-keys.js';
	import { createPositioner } from '../internal/floating.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { TooltipContext, TooltipPositionerProps } from './types.js';

	let {
		side = 'top',
		align = 'center',
		sideOffset = 8,
		class: className,
		style,
		children,
		...rest
	}: TooltipPositionerProps = $props();

	const ctx = getContext<TooltipContext>(TOOLTIP_CONTEXT);

	let positionerEl = $state<HTMLElement | null>(null);
	let arrowEl = $state<HTMLElement | null>(null);

	$effect(() => {
		ctx.refs.positioner = positionerEl;
		return () => {
			if (ctx.refs.positioner === positionerEl) {
				ctx.refs.positioner = null;
			}
		};
	});

	setContext(TOOLTIP_POSITIONER_CONTEXT, {
		get side() {
			return side;
		},
		setArrow(el: HTMLElement | null) {
			arrowEl = el;
		},
	});

	createPositioner({
		get open() {
			return ctx.open;
		},
		anchor: () => ctx.refs.trigger,
		floating: () => positionerEl,
		arrowEl: () => arrowEl,
		get side() {
			return side;
		},
		get align() {
			return align;
		},
		get sideOffset() {
			return sideOffset;
		},
	});

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style,
			role: 'presentation',
			'data-open': ctx.open ? '' : undefined,
			'data-closed': !ctx.open ? '' : undefined,
			'data-side': side,
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
