<script lang="ts">
	import { getContext } from 'svelte';
	import { COMBOBOX_CHIP_CONTEXT, COMBOBOX_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type {
		ComboboxChipContext,
		ComboboxChipRemoveProps,
		ComboboxContext
	} from './types.js';

	let {
		disabled = false,
		class: className,
		style,
		children,
		...rest
	}: ComboboxChipRemoveProps = $props();

	const ctx = getContext<ComboboxContext>(COMBOBOX_CONTEXT);
	const chip = getContext<ComboboxChipContext>(COMBOBOX_CHIP_CONTEXT);

	const isDisabled = $derived(Boolean(disabled || ctx.disabled));

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			type: 'button',
			class: className,
			style,
			disabled: isDisabled || undefined,
			tabindex: -1,
			'aria-label': 'Remove',
			'data-disabled': isDisabled ? '' : undefined,
			onclick: (event: MouseEvent) => {
				if (isDisabled) return;
				event.preventDefault();
				ctx.removeValue(chip.value, event);
			}
		})
	);
</script>

<button {...mergedProps} style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}>
	{#if children}
		{@render children()}
	{:else}
		×
	{/if}
</button>
