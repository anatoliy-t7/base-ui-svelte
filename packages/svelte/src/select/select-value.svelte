<script lang="ts">
	import { getContext } from 'svelte';
	import { SELECT_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { SelectContext, SelectValueProps } from './types.js';

	let {
		placeholder = '',
		class: className,
		style,
		children,
		...rest
	}: SelectValueProps = $props();

	const ctx = getContext<SelectContext>(SELECT_CONTEXT);

	const displayText = $derived(
		ctx.value != null ? (ctx.getSelectedLabel() ?? '') : placeholder
	);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style,
			'data-placeholder': ctx.value == null ? '' : undefined
		})
	);
</script>

<span {...mergedProps} style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}>
	{#if children}
		{@render children(ctx.value)}
	{:else}
		{displayText}
	{/if}
</span>
