<script lang="ts">
	import { getContext } from 'svelte';
	import { NAVIGATION_MENU_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { NavigationMenuContext, NavigationMenuIconProps } from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: NavigationMenuIconProps = $props();

	const ctx = getContext<NavigationMenuContext>(NAVIGATION_MENU_CONTEXT);

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

<span {...mergedProps} style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}>
	{#if children}
		{@render children()}
	{/if}
</span>
