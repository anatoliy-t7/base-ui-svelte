<script lang="ts">
	import { getContext } from 'svelte';
	import { NUMBER_FIELD_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { NumberFieldContext, NumberFieldDecrementProps } from './types.js';

	let {
		disabled = false,
		class: className,
		style,
		children,
		...rest
	}: NumberFieldDecrementProps = $props();

	const ctx = getContext<NumberFieldContext>(NUMBER_FIELD_CONTEXT);

	const isDisabled = $derived(Boolean(disabled || !ctx.canDecrement));

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			type: 'button',
			class: className,
			style,
			disabled: isDisabled || undefined,
			'aria-label': 'Decrement',
			'aria-controls': ctx.inputId,
			'data-disabled': isDisabled ? '' : undefined,
			onclick: (event: MouseEvent) => {
				if (isDisabled) return;
				ctx.decrement(event);
			}
		})
	);
</script>

<button
	{...mergedProps}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
>
	{#if children}
		{@render children()}
	{:else}
		−
	{/if}
</button>
