<script lang="ts">
	import { getContext } from 'svelte';
	import { AUTOCOMPLETE_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { AutocompleteClearProps, AutocompleteContext } from './types.js';

	let {
		disabled = false,
		class: className,
		style,
		children,
		...rest
	}: AutocompleteClearProps = $props();

	const ctx = getContext<AutocompleteContext>(AUTOCOMPLETE_CONTEXT);

	const isDisabled = $derived(Boolean(disabled || ctx.disabled));
	const isEmpty = $derived(ctx.value == null && ctx.inputValue === '');

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			type: 'button',
			class: className,
			style,
			disabled: isDisabled || undefined,
			tabindex: -1,
			'aria-label': 'Clear',
			'data-disabled': isDisabled ? '' : undefined,
			'data-empty': isEmpty ? '' : undefined,
			'data-hidden': isEmpty ? '' : undefined,
			hidden: isEmpty ? true : undefined,
			onclick: (event: MouseEvent) => {
				if (isDisabled || isEmpty) return;
				ctx.clear(event);
			},
		}),
	);
</script>

<button
	{...mergedProps}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
>
	{#if children}
		{@render children()}
	{:else}
		×
	{/if}
</button>
