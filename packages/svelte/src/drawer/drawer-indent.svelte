<script lang="ts">
	import { getContext, hasContext } from 'svelte';
	import { DRAWER_PROVIDER_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { DrawerIndentProps, DrawerProviderContext } from './types.js';

	let {
		render = 'div',
		class: className,
		style,
		children,
		...rest
	}: DrawerIndentProps = $props();

	const provider = hasContext(DRAWER_PROVIDER_CONTEXT)
		? getContext<DrawerProviderContext>(DRAWER_PROVIDER_CONTEXT)
		: undefined;

	const active = $derived((provider?.openCount ?? 0) > 0);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style: [
				`--drawer-open-count: ${provider?.openCount ?? 0}`,
				`--drawer-swipe-direction: ${provider?.swipeDirection ?? 'down'}`,
				typeof style === 'string' ? style : undefined
			]
				.filter(Boolean)
				.join(';'),
			'data-active': active ? '' : undefined,
			'data-inactive': !active ? '' : undefined,
			'data-swipe-direction': provider?.swipeDirection
		})
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
