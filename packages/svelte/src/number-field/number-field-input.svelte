<script lang="ts">
	import { getContext } from 'svelte';
	import { NUMBER_FIELD_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { NumberFieldContext, NumberFieldInputProps } from './types.js';

	let {
		disabled = false,
		class: className,
		style,
		...rest
	}: NumberFieldInputProps = $props();

	const ctx = getContext<NumberFieldContext>(NUMBER_FIELD_CONTEXT);

	const isDisabled = $derived(Boolean(disabled || ctx.disabled));

	function onInput(event: Event): void {
		if (isDisabled) return;
		const target = event.currentTarget;
		if (!(target instanceof HTMLInputElement)) return;
		ctx.setInputValue(target.value, event);
	}

	function onBlur(event: FocusEvent): void {
		if (isDisabled) return;
		ctx.commitInput(event);
	}

	function onKeyDown(event: KeyboardEvent): void {
		if (isDisabled) return;
		if (event.key === 'ArrowUp') {
			event.preventDefault();
			ctx.increment(event);
		} else if (event.key === 'ArrowDown') {
			event.preventDefault();
			ctx.decrement(event);
		} else if (event.key === 'Enter') {
			ctx.commitInput(event);
		}
	}

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id: ctx.inputId,
			type: 'text',
			role: 'spinbutton',
			inputMode: 'decimal',
			class: className,
			style,
			disabled: isDisabled || undefined,
			value: ctx.inputValue,
			required: ctx.required || undefined,
			autocomplete: 'off',
			'aria-valuemin': ctx.min,
			'aria-valuemax': ctx.max,
			'aria-valuenow': ctx.value ?? undefined,
			'aria-disabled': isDisabled || undefined,
			'aria-required': ctx.required || undefined,
			'data-disabled': isDisabled ? '' : undefined,
			oninput: onInput,
			onblur: (event: FocusEvent) => {
				ctx.setInputFocused(false);
				onBlur(event);
			},
			onfocus: () => {
				ctx.setInputFocused(true);
			},
			onkeydown: onKeyDown
		})
	);
</script>

<input
	{...mergedProps}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
/>
