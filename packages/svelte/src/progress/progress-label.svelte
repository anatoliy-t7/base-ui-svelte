<script lang="ts">
	import { getContext } from 'svelte';
	import { PROGRESS_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { ProgressContext, ProgressLabelProps } from './types.js';

	let { class: className, style, id, children, ...rest }: ProgressLabelProps = $props();

	const ctx = getContext<ProgressContext>(PROGRESS_CONTEXT);

	const labelProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id: id ?? ctx.labelId,
			class: className,
			style,
			'data-complete': ctx.status === 'complete' ? '' : undefined,
			'data-indeterminate': ctx.status === 'indeterminate' ? '' : undefined,
			'data-progressing': ctx.status === 'progressing' ? '' : undefined,
		}),
	);
</script>

<span {...labelProps}>
	{#if children}
		{@render children()}
	{/if}
</span>
