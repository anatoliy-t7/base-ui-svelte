<script lang="ts">
	import { getContext } from 'svelte';
	import { PROGRESS_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { ProgressContext, ProgressValueProps } from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: ProgressValueProps = $props();

	const ctx = getContext<ProgressContext>(PROGRESS_CONTEXT);

	const valueProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style,
			'data-complete': ctx.status === 'complete' ? '' : undefined,
			'data-indeterminate': ctx.status === 'indeterminate' ? '' : undefined,
			'data-progressing': ctx.status === 'progressing' ? '' : undefined
		})
	);
</script>

<span {...valueProps}>
	{#if children}
		{@render children(ctx.formattedValue, ctx.value)}
	{:else}
		{ctx.formattedValue ?? ''}
	{/if}
</span>
