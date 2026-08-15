<script lang="ts">
	import { getContext } from 'svelte';
	import { DRAWER_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { DrawerContext, DrawerViewportProps } from './types.js';

	let {
		render = 'div',
		class: className,
		style,
		children,
		...rest
	}: DrawerViewportProps = $props();

	const ctx = getContext<DrawerContext>(DRAWER_CONTEXT);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style,
			'data-open': ctx.open ? '' : undefined,
			'data-closed': !ctx.open ? '' : undefined,
			'data-swipe-direction': ctx.swipeDirection
		})
	);
</script>

{#if ctx.presence.isPresent}
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
