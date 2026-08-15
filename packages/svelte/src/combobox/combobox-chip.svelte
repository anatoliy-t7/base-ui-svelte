<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import { COMBOBOX_CHIP_CONTEXT, COMBOBOX_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type {
		ComboboxChipContext,
		ComboboxChipProps,
		ComboboxContext
	} from './types.js';

	let {
		value,
		class: className,
		style,
		children,
		...rest
	}: ComboboxChipProps = $props();

	const ctx = getContext<ComboboxContext>(COMBOBOX_CONTEXT);
	const label = $derived(ctx.getLabelForValue(value));
	const isDisabled = $derived(ctx.disabled);

	setContext(COMBOBOX_CHIP_CONTEXT, {
		get value() {
			return value;
		}
	} satisfies ComboboxChipContext);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style,
			'data-disabled': isDisabled ? '' : undefined
		})
	);
</script>

<div {...mergedProps} style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}>
	{#if children}
		{@render children()}
	{:else}
		{label}
	{/if}
</div>
