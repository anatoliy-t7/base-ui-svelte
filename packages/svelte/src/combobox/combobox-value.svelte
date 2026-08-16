<script lang="ts">
	import { getContext } from 'svelte';
	import { COMBOBOX_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { ComboboxContext, ComboboxValueProps } from './types.js';

	let {
		placeholder = '',
		class: className,
		style,
		children,
		...rest
	}: ComboboxValueProps = $props();

	const ctx = getContext<ComboboxContext>(COMBOBOX_CONTEXT);

	const hasSelection = $derived(ctx.getSelectedValues().length > 0);
	const displayText = $derived(hasSelection ? (ctx.getSelectedLabel() ?? '') : placeholder);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style,
			'data-placeholder': !hasSelection ? '' : undefined,
		}),
	);
</script>

<span
	{...mergedProps}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
>
	{#if children}
		{@render children(ctx.value)}
	{:else}
		{displayText}
	{/if}
</span>
