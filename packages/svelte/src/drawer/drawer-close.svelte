<script lang="ts">
	import { getContext } from 'svelte';
	import { DRAWER_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { DrawerCloseProps, DrawerContext } from './types.js';

	let {
		render = 'button',
		class: className,
		style,
		children,
		...rest
	}: DrawerCloseProps = $props();

	const ctx = getContext<DrawerContext>(DRAWER_CONTEXT);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			type: render === 'button' ? 'button' : undefined,
			class: className,
			style,
			onclick: () => {
				ctx.setOpen(false, 'close-press');
			}
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
