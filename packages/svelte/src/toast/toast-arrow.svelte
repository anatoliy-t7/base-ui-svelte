<script lang="ts">
	import { getContext, hasContext } from 'svelte';
	import { TOAST_CONTEXT, TOAST_POSITIONER_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { ToastArrowProps, ToastContext } from './types.js';

	type ToastPositionerContext = {
		readonly side: string;
		setArrow(el: HTMLElement | null): void;
	};

	let {
		class: className,
		style,
		children,
		...rest
	}: ToastArrowProps = $props();

	const ctx = getContext<ToastContext>(TOAST_CONTEXT);
	const positioner = hasContext(TOAST_POSITIONER_CONTEXT)
		? getContext<ToastPositionerContext>(TOAST_POSITIONER_CONTEXT)
		: undefined;

	let arrowEl = $state<HTMLElement | null>(null);

	$effect(() => {
		positioner?.setArrow(arrowEl);
		return () => {
			positioner?.setArrow(null);
		};
	});

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style,
			'aria-hidden': 'true',
			'data-anchored': ctx.toast?.anchor ? '' : undefined,
			'data-side': positioner?.side
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
	{/if}
</span>
