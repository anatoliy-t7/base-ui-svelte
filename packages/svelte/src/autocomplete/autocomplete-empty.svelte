<script lang="ts">
	import { getContext } from 'svelte';
	import { AUTOCOMPLETE_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { AutocompleteContext, AutocompleteEmptyProps } from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: AutocompleteEmptyProps = $props();

	const ctx = getContext<AutocompleteContext>(AUTOCOMPLETE_CONTEXT);

	const isEmpty = $derived(ctx.getVisibleItems().length === 0);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style,
			role: 'status',
			'data-empty': isEmpty ? '' : undefined
		})
	);
</script>

{#if isEmpty}
	<div {...mergedProps} style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}>
		{#if children}
			{@render children()}
		{:else}
			No results
		{/if}
	</div>
{/if}
