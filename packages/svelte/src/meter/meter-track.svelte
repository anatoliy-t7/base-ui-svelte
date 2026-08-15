<script lang="ts">
	import { getContext } from 'svelte';
	import { METER_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { MeterContext, MeterTrackProps } from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: MeterTrackProps = $props();

	const ctx = getContext<MeterContext>(METER_CONTEXT);

	const trackProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style,
			'data-complete': ctx.status === 'complete' ? '' : undefined,
			'data-progressing': ctx.status === 'progressing' ? '' : undefined
		})
	);
</script>

<div {...trackProps}>
	{#if children}
		{@render children()}
	{/if}
</div>
