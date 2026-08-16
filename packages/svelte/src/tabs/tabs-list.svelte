<script lang="ts">
	import { getContext } from 'svelte';
	import { TABS_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { TabsContext, TabsListProps } from './types.js';

	let { class: className, style, children, ...rest }: TabsListProps = $props();

	const ctx = getContext<TabsContext>(TABS_CONTEXT);

	let listEl = $state<HTMLElement | null>(null);

	$effect(() => {
		ctx.setListElement(listEl);
		return () => {
			if (ctx.listElement === listEl) {
				ctx.setListElement(null);
			}
		};
	});

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			role: 'tablist',
			class: className,
			style,
			'aria-orientation': ctx.orientation,
			'data-orientation': ctx.orientation,
		}),
	);
</script>

<div
	{...mergedProps}
	bind:this={listEl}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
>
	{#if children}
		{@render children()}
	{/if}
</div>
