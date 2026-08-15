<script lang="ts">
	import { getContext } from 'svelte';
	import { COMBOBOX_CONTEXT } from '../internal/context-keys.js';
	import { createPositioner } from '../internal/floating.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { ComboboxContext, ComboboxPositionerProps } from './types.js';

	let {
		side = 'bottom',
		align = 'start',
		sideOffset = 4,
		class: className,
		style,
		children,
		...rest
	}: ComboboxPositionerProps = $props();

	const ctx = getContext<ComboboxContext>(COMBOBOX_CONTEXT);

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
		anchor: () => ctx.refs.input ?? ctx.refs.trigger,
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
		}
	});

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style,
			'data-open': ctx.open ? '' : undefined,
			'data-closed': !ctx.open ? '' : undefined
		})
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
