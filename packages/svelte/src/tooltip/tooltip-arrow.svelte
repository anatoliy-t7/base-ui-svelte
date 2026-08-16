<script lang="ts">
	import { getContext, hasContext } from 'svelte';
	import { TOOLTIP_CONTEXT, TOOLTIP_POSITIONER_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { TooltipArrowProps, TooltipContext } from './types.js';

	type TooltipPositionerContext = {
		readonly side: string;
		setArrow(el: HTMLElement | null): void;
	};

	let {
		class: className,
		style,
		children,
		...rest
	}: TooltipArrowProps = $props();

	const ctx = getContext<TooltipContext>(TOOLTIP_CONTEXT);
	const positioner = hasContext(TOOLTIP_POSITIONER_CONTEXT)
		? getContext<TooltipPositionerContext>(TOOLTIP_POSITIONER_CONTEXT)
		: undefined;

	let arrowEl = $state<HTMLElement | null>(null);

	$effect(() => {
		positioner?.setArrow(arrowEl);
		ctx.refs.arrow = arrowEl;
		return () => {
			positioner?.setArrow(null);
			if (ctx.refs.arrow === arrowEl) {
				ctx.refs.arrow = null;
			}
		};
	});

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style,
			'aria-hidden': 'true',
			'data-open': ctx.open ? '' : undefined,
			'data-closed': !ctx.open ? '' : undefined
		})
	);
</script>

<span
	{...mergedProps}
	bind:this={arrowEl}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
>
	{#if children}
		{@render children()}
	{:else}
		<svg width="12" height="6" viewBox="0 0 12 6" fill="currentColor">
			<path d="M0 0 L6 6 L12 0" />
		</svg>
	{/if}
</span>
