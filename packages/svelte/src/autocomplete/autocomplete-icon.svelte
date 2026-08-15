<script lang="ts">
	import { getContext } from 'svelte';
	import { AUTOCOMPLETE_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { AutocompleteContext, AutocompleteIconProps } from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: AutocompleteIconProps = $props();

	const ctx = getContext<AutocompleteContext>(AUTOCOMPLETE_CONTEXT);

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
