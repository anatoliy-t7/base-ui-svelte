<script lang="ts">
	import { getContext } from 'svelte';
	import { PROGRESS_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { ProgressContext, ProgressTrackProps } from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: ProgressTrackProps = $props();

	const ctx = getContext<ProgressContext>(PROGRESS_CONTEXT);

	const trackProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style,
			'data-complete': ctx.status === 'complete' ? '' : undefined,
			'data-indeterminate': ctx.status === 'indeterminate' ? '' : undefined,
			'data-progressing': ctx.status === 'progressing' ? '' : undefined
		})
	);
</script>

<div {...trackProps}>
	{#if children}
		{@render children()}
	{/if}
</div>
