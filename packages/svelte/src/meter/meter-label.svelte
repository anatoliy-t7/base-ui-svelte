<script lang="ts">
	import { getContext } from 'svelte';
	import { METER_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { MeterContext, MeterLabelProps } from './types.js';

	let {
		class: className,
		style,
		id,
		children,
		...rest
	}: MeterLabelProps = $props();

	const ctx = getContext<MeterContext>(METER_CONTEXT);

	const labelProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id: id ?? ctx.labelId,
			class: className,
			style,
			'data-complete': ctx.status === 'complete' ? '' : undefined,
			'data-progressing': ctx.status === 'progressing' ? '' : undefined
		})
	);
</script>

<span {...labelProps}>
	{#if children}
		{@render children()}
	{/if}
</span>
