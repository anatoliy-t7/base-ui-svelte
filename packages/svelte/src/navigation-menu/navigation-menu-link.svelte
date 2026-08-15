<script lang="ts">
	import { getContext } from 'svelte';
	import { NAVIGATION_MENU_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { NavigationMenuContext, NavigationMenuLinkProps } from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: NavigationMenuLinkProps = $props();

	const root = getContext<NavigationMenuContext>(NAVIGATION_MENU_CONTEXT);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style,
			role: 'menuitem',
			onpointerenter: () => {
				root.close();
			}
		})
	);
</script>

<a {...mergedProps} style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}>
	{#if children}
		{@render children()}
	{/if}
</a>
