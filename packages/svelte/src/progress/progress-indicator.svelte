<script lang="ts">
	import { getContext } from 'svelte';
	import { PROGRESS_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { ProgressContext, ProgressIndicatorProps } from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: ProgressIndicatorProps = $props();

	const ctx = getContext<ProgressContext>(PROGRESS_CONTEXT);

	const percentage = $derived(
		ctx.value === null ? undefined : ((ctx.value - ctx.min) / (ctx.max - ctx.min)) * 100
	);

	const indicatorStyle = $derived.by(() => {
		const parts = ['height:100%'];
		if (percentage !== undefined) {
			parts.push(`width:${percentage}%`);
		}
		if (typeof style === 'string' && style.length > 0) {
			parts.push(style);
		} else if (typeof style === 'object' && style !== null) {
			for (const [key, value] of Object.entries(style)) {
				if (value != null && value !== '') {
					parts.push(`${key}:${value}`);
				}
			}
		}
		return parts.join(';');
	});

	const indicatorProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style: indicatorStyle,
			'data-complete': ctx.status === 'complete' ? '' : undefined,
			'data-indeterminate': ctx.status === 'indeterminate' ? '' : undefined,
			'data-progressing': ctx.status === 'progressing' ? '' : undefined
		})
	);
</script>

<div {...indicatorProps}>
	{#if children}
		{@render children()}
	{/if}
</div>
