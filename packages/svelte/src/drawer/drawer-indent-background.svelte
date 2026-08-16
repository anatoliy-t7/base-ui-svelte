<script lang="ts">
	import { getContext, hasContext } from 'svelte';
	import { DRAWER_PROVIDER_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { DrawerIndentBackgroundProps, DrawerProviderContext } from './types.js';

	let {
		render = 'div',
		class: className,
		style,
		children,
		...rest
	}: DrawerIndentBackgroundProps = $props();

	const provider = hasContext(DRAWER_PROVIDER_CONTEXT)
		? getContext<DrawerProviderContext>(DRAWER_PROVIDER_CONTEXT)
		: undefined;

	const active = $derived((provider?.openCount ?? 0) > 0);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style,
			'data-active': active ? '' : undefined,
			'data-inactive': !active ? '' : undefined,
			'data-swipe-direction': provider?.swipeDirection,
			'aria-hidden': 'true',
		}),
	);
</script>

<svelte:element
	this={render}
	{...mergedProps}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
>
	{#if children}
		{@render children()}
	{/if}
</svelte:element>
