<script lang="ts">
	import { getContext } from 'svelte';
	import { COMBOBOX_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { ComboboxContext, ComboboxListProps } from './types.js';

	let { class: className, style, children, ...rest }: ComboboxListProps = $props();

	const ctx = getContext<ComboboxContext>(COMBOBOX_CONTEXT);

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
			'aria-labelledby': ctx.inputId,
			'data-open': ctx.open ? '' : undefined,
			'data-closed': !ctx.open ? '' : undefined,
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
