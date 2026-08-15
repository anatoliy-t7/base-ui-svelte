<script lang="ts">
	import { getContext } from 'svelte';
	import { NUMBER_FIELD_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { NumberFieldContext, NumberFieldGroupProps } from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: NumberFieldGroupProps = $props();

	const ctx = getContext<NumberFieldContext>(NUMBER_FIELD_CONTEXT);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			role: 'group',
			class: className,
			style,
			'data-disabled': ctx.disabled ? '' : undefined
		})
	);
</script>

<div {...mergedProps} style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}>
	{#if children}
		{@render children()}
	{/if}
</div>
