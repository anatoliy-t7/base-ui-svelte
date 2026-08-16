<script lang="ts">
	import { getContext } from 'svelte';
	import { NAVIGATION_MENU_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { NavigationMenuContext, NavigationMenuViewportProps } from './types.js';

	let { class: className, style, children, ...rest }: NavigationMenuViewportProps = $props();

	const ctx = getContext<NavigationMenuContext>(NAVIGATION_MENU_CONTEXT);

	const activeContent = $derived.by(() => {
		const value = ctx.value;
		if (value == null) return undefined;
		return ctx.getContent(value);
	});

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style,
			'data-open': ctx.open ? '' : undefined,
			'data-closed': !ctx.open ? '' : undefined,
		}),
	);
</script>

<div {...mergedProps} style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}>
	{#if activeContent}
		{@render activeContent()}
	{/if}
	{#if children}
		{@render children()}
	{/if}
</div>
