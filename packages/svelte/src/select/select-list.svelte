<script lang="ts">
	import { getContext } from 'svelte';
	import { SELECT_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { SelectContext, SelectListProps } from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: SelectListProps = $props();

	const ctx = getContext<SelectContext>(SELECT_CONTEXT);

	let listEl = $state<HTMLElement | null>(null);

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
			id: ctx.listId,
			role: 'listbox',
			class: className,
			style,
			tabindex: -1,
			'aria-labelledby': ctx.labelId ?? ctx.triggerId,
			'data-open': ctx.open ? '' : undefined,
			'data-closed': !ctx.open ? '' : undefined
		})
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
