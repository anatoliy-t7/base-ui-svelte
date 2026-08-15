<script lang="ts">
	import { getContext, hasContext } from 'svelte';
	import { FIELDSET_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { FieldsetContext, FieldsetLegendProps } from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: FieldsetLegendProps = $props();

	const ctx = hasContext(FIELDSET_CONTEXT)
		? getContext<FieldsetContext>(FIELDSET_CONTEXT)
		: undefined;

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style,
			'data-disabled': ctx?.disabled ? '' : undefined
		})
	);
</script>

<legend {...mergedProps} style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}>
	{#if children}
		{@render children()}
	{/if}
</legend>
