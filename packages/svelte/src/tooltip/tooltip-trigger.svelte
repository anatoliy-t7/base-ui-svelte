<script lang="ts">
	import { getContext } from 'svelte';
	import { TOOLTIP_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { TooltipContext, TooltipTriggerProps } from './types.js';

	let {
		render = 'button',
		disabled = false,
		class: className,
		style,
		children,
		...rest
	}: TooltipTriggerProps = $props();

	const ctx = getContext<TooltipContext>(TOOLTIP_CONTEXT);

	let triggerEl = $state<HTMLElement | null>(null);

	$effect(() => {
		ctx.refs.trigger = triggerEl;
		return () => {
			if (ctx.refs.trigger === triggerEl) {
				ctx.refs.trigger = null;
			}
		};
	});

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id: ctx.triggerId,
			type: render === 'button' ? 'button' : undefined,
			class: className,
			style,
			disabled: disabled || undefined,
			'aria-describedby': ctx.open ? ctx.popupId : undefined,
			'data-open': ctx.open ? '' : undefined,
			'data-closed': !ctx.open ? '' : undefined,
			'data-disabled': disabled ? '' : undefined,
			onpointerenter: () => {
				if (disabled) return;
				ctx.openWithDelay('trigger-hover');
			},
			onpointerleave: () => {
				if (disabled) return;
				ctx.closeWithDelay('trigger-hover');
			},
			onfocus: () => {
				if (disabled) return;
				ctx.openWithDelay('trigger-focus');
			},
			onblur: () => {
				if (disabled) return;
				ctx.closeWithDelay('trigger-focus');
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
