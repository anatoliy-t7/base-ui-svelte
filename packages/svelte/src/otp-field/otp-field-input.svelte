<script lang="ts">
	import { getContext } from 'svelte';
	import { OTP_FIELD_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { OtpFieldContext, OtpFieldInputProps } from './types.js';

	let {
		index: indexProp,
		disabled = false,
		class: className,
		style,
		...rest
	}: OtpFieldInputProps = $props();

	const ctx = getContext<OtpFieldContext>(OTP_FIELD_CONTEXT);
	const registeredIndex = ctx.registerInput();
	const index = $derived(typeof indexProp === 'number' ? indexProp : registeredIndex);
	const isDisabled = $derived(Boolean(disabled || ctx.disabled));
	const slotValue = $derived(ctx.slots[index] ?? '');

	function onInput(event: Event): void {
		if (isDisabled) return;
		const target = event.currentTarget;
		if (!(target instanceof HTMLInputElement)) return;
		const next = target.value;
		if (next === '') {
			ctx.clearSlot(index, event);
			return;
		}
		if (next.length > 1) {
			ctx.handlePaste(index, next, event);
			return;
		}
		ctx.setSlot(index, next, event);
	}

	function onKeyDown(event: KeyboardEvent): void {
		if (isDisabled) return;

		switch (event.key) {
			case 'Backspace': {
				event.preventDefault();
				ctx.clearSlot(index, event);
				break;
			}
			case 'ArrowLeft': {
				event.preventDefault();
				ctx.focusSlot(Math.max(0, index - 1));
				break;
			}
			case 'ArrowRight': {
				event.preventDefault();
				ctx.focusSlot(Math.min(ctx.length - 1, index + 1));
				break;
			}
			case 'Home': {
				event.preventDefault();
				ctx.focusSlot(0);
				break;
			}
			case 'End': {
				event.preventDefault();
				ctx.focusSlot(ctx.length - 1);
				break;
			}
		}
	}

	function onPaste(event: ClipboardEvent): void {
		if (isDisabled) return;
		const text = event.clipboardData?.getData('text') ?? '';
		if (!text) return;
		event.preventDefault();
		ctx.handlePaste(index, text, event);
	}

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			type: ctx.type,
			inputMode: 'numeric',
			autocomplete: index === 0 ? 'one-time-code' : 'off',
			maxLength: 1,
			class: className,
			style,
			disabled: isDisabled || undefined,
			value: slotValue,
			'aria-label': `Digit ${index + 1} of ${ctx.length}`,
			'aria-disabled': isDisabled || undefined,
			'data-disabled': isDisabled ? '' : undefined,
			'data-index': index,
			oninput: onInput,
			onkeydown: onKeyDown,
			onpaste: onPaste,
			onfocus: (event: FocusEvent) => {
				const target = event.currentTarget;
				if (target instanceof HTMLInputElement) {
					target.select();
				}
			}
		})
	);
</script>

<input
	{...mergedProps}
	{@attach (element) => {
		if (!(element instanceof HTMLInputElement)) return;
		ctx.registerElement(index, element);
		if (ctx.autoFocus && index === 0) {
			element.focus();
		}
		return () => {
			ctx.registerElement(index, null);
		};
	}}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
/>
