<script lang="ts">
	import { getContext } from 'svelte';
	import { NAVIGATION_MENU_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { NavigationMenuContext, NavigationMenuListProps } from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: NavigationMenuListProps = $props();

	const ctx = getContext<NavigationMenuContext>(NAVIGATION_MENU_CONTEXT);

	let listEl = $state<HTMLUListElement | null>(null);

	$effect(() => {
		ctx.refs.list = listEl;
		return () => {
			if (ctx.refs.list === listEl) {
				ctx.refs.list = null;
			}
		};
	});

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style,
			role: 'menubar',
			'aria-orientation': ctx.orientation,
			'data-orientation': ctx.orientation
		})
	);
</script>

<ul
	{...mergedProps}
	bind:this={listEl}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
>
	{#if children}
		{@render children()}
	{/if}
</ul>
