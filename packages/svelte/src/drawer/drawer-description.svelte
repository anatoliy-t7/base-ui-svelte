<script lang="ts">
	import { getContext } from 'svelte';
	import { DRAWER_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { DrawerContext, DrawerDescriptionProps } from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: DrawerDescriptionProps = $props();

	const ctx = getContext<DrawerContext>(DRAWER_CONTEXT);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id: ctx.descriptionId,
			class: className,
			style
		})
	);
</script>

<p {...mergedProps} style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}>
	{#if children}
		{@render children()}
	{/if}
</p>
