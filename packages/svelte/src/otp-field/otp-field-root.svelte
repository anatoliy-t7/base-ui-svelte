<script lang="ts">
	import { setContext } from 'svelte';
	import { useId } from '../internal/controllable.svelte.js';
	import { OTP_FIELD_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { OtpFieldContext, OtpFieldRootProps } from './types.js';

	let {
		length = 6,
		value = $bindable(undefined),
		defaultValue = '',
		onValueChange,
		onComplete,
		disabled = false,
		type = 'text',
		pattern,
		autoFocus = false,
		name,
		class: className,
		style,
		id = useId('otp-field'),
		children,
		...rest
	}: OtpFieldRootProps = $props();

	let uncontrolledValue = $state<string | undefined>(undefined);
	let nextIndex = 0;
	const elements: (HTMLInputElement | null)[] = [];

	const isValueControlled = $derived(value !== undefined);
	const currentValue = $derived(
		value !== undefined ? value : (uncontrolledValue ?? defaultValue)
	);

	const slots = $derived.by(() => {
		const chars = currentValue.split('');
		return Array.from({ length }, (_, i) => chars[i] ?? '');
	});

	function isAllowedChar(char: string): boolean {
		if (!char) return true;
		if (pattern) {
			try {
				return new RegExp(`^(?:${pattern})$`).test(char);
			} catch {
				return true;
			}
		}
		return /^\d$/.test(char);
	}

	function writeValue(next: string, event: Event): void {
		if (disabled) return;
		const clipped = next.slice(0, length);
		if (isValueControlled) {
			value = clipped;
		} else {
			uncontrolledValue = clipped;
		}
		onValueChange?.(clipped, event);
		if (clipped.length === length) {
			onComplete?.(clipped);
		}
	}

	function slotsToValue(nextSlots: string[]): string {
		return nextSlots.join('').slice(0, length);
	}

	function setSlot(index: number, char: string, event: Event): void {
		if (disabled || index < 0 || index >= length) return;
		const nextChar = char.slice(-1);
		if (nextChar && !isAllowedChar(nextChar)) return;
		const nextSlots = [...slots];
		nextSlots[index] = nextChar;
		writeValue(slotsToValue(nextSlots), event);
		if (nextChar && index < length - 1) {
			focusSlot(index + 1);
		}
	}

	function clearSlot(index: number, event: Event): void {
		if (disabled || index < 0 || index >= length) return;
		const nextSlots = [...slots];
		if (nextSlots[index]) {
			nextSlots[index] = '';
			writeValue(slotsToValue(nextSlots), event);
			return;
		}
		if (index > 0) {
			nextSlots[index - 1] = '';
			writeValue(slotsToValue(nextSlots), event);
			focusSlot(index - 1);
		}
	}

	function focusSlot(index: number): void {
		const el = elements[index];
		el?.focus();
		el?.select();
	}

	function handlePaste(index: number, text: string, event: Event): void {
		if (disabled) return;
		const chars = [...text].filter((char) => isAllowedChar(char));
		if (chars.length === 0) return;
		const nextSlots = [...slots];
		let cursor = index;
		for (const char of chars) {
			if (cursor >= length) break;
			nextSlots[cursor] = char;
			cursor += 1;
		}
		writeValue(slotsToValue(nextSlots), event);
		const focusIndex = Math.min(cursor, length - 1);
		focusSlot(focusIndex);
	}

	function registerInput(): number {
		const index = nextIndex;
		nextIndex += 1;
		return index;
	}

	function registerElement(index: number, element: HTMLInputElement | null): void {
		elements[index] = element;
	}

	setContext(OTP_FIELD_CONTEXT, {
		get value() {
			return currentValue;
		},
		get slots() {
			return slots;
		},
		get length() {
			return length;
		},
		get disabled() {
			return disabled;
		},
		get type() {
			return type;
		},
		get pattern() {
			return pattern;
		},
		get autoFocus() {
			return autoFocus;
		},
		get name() {
			return name;
		},
		registerInput,
		setSlot,
		clearSlot,
		focusSlot,
		handlePaste,
		registerElement
	} satisfies OtpFieldContext);

	const rootProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			class: className,
			style,
			role: 'group',
			'data-disabled': disabled ? '' : undefined
		})
	);
</script>

<div {...rootProps} style={typeof rootProps.style === 'string' ? rootProps.style : undefined}>
	{#if children}
		{@render children({ value: currentValue, disabled })}
	{/if}
	{#if name && !disabled}
		<input type="hidden" {name} value={currentValue} />
	{/if}
</div>
