<script lang="ts">
	import { setContext } from 'svelte';
	import { useId } from '../internal/controllable.svelte.js';
	import { NUMBER_FIELD_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import { isIncompleteNumberInput, parseNumberInput } from './parse-number.js';
	import type { NumberFieldContext, NumberFieldRootProps } from './types.js';

	let {
		value = $bindable(undefined),
		defaultValue = null,
		onValueChange,
		onValueCommitted,
		min,
		max,
		step = 1,
		smallStep = 1,
		largeStep = 10,
		allowOutOfRange = false,
		snapOnStep = true,
		locale,
		format,
		disabled = false,
		readOnly = false,
		name,
		form,
		required = false,
		class: className,
		style,
		id = useId('number-field'),
		children,
		...rest
	}: NumberFieldRootProps = $props();

	let uncontrolledValue = $state<number | null | undefined>(undefined);
	let inputValue = $state('');
	let inputFocused = $state(false);
	let scrubbing = $state(false);
	let scrubStartX = $state(0);
	let scrubStartValue = $state<number | null>(null);
	let scrubPointer = $state<{ x: number; y: number } | null>(null);
	let scrubPixelSensitivity = $state(2);

	const isValueControlled = $derived(value !== undefined);
	const currentValue = $derived(value !== undefined ? value : (uncontrolledValue ?? defaultValue));

	const inputId = useId('number-field-input');

	const formatter = $derived.by(() => {
		if (format == null && locale == null) return null;
		return new Intl.NumberFormat(locale, format);
	});

	function clamp(next: number): number {
		let result = next;
		if (!allowOutOfRange) {
			if (min !== undefined) result = Math.max(min, result);
			if (max !== undefined) result = Math.min(max, result);
		}
		if (snapOnStep && step > 0 && min !== undefined) {
			const stepped = Math.round((result - min) / step) * step + min;
			result = Number(stepped.toFixed(10));
			if (!allowOutOfRange) {
				if (min !== undefined) result = Math.max(min, result);
				if (max !== undefined) result = Math.min(max, result);
			}
		}
		return result;
	}

	function parseNumber(raw: string): number | null {
		return parseNumberInput(raw, locale, format);
	}

	function formatDisplay(next: number | null): string {
		if (next == null) return '';
		return formatter ? formatter.format(next) : String(next);
	}

	function syncInputFromValue(next: number | null): void {
		inputValue = formatDisplay(next);
	}

	function writeValue(next: number | null, event: Event, syncInput: boolean): void {
		if (disabled || readOnly) return;
		if (isValueControlled) {
			value = next;
		} else {
			uncontrolledValue = next;
		}
		if (syncInput) {
			syncInputFromValue(next);
		}
		onValueChange?.(next, event);
	}

	function setValue(next: number | null, event: Event): void {
		writeValue(next, event, true);
	}

	function setInputValue(next: string, event?: Event): void {
		if (disabled || readOnly) return;
		inputValue = next;
		if (!event) return;
		if (isIncompleteNumberInput(next, locale, format)) {
			writeValue(null, event, false);
			return;
		}
		const parsed = parseNumber(next);
		if (parsed != null) {
			writeValue(parsed, event, false);
		}
	}

	function commitInput(event: Event): void {
		if (disabled || readOnly) return;
		const parsed = parseNumber(inputValue);
		if (parsed == null) {
			writeValue(null, event, true);
			onValueCommitted?.(null, event);
			return;
		}
		const next = clamp(parsed);
		writeValue(next, event, true);
		onValueCommitted?.(next, event);
	}

	function resolveStepAmount(event: Event): number {
		if (event instanceof KeyboardEvent || event instanceof MouseEvent) {
			if (event.shiftKey) return largeStep;
			if (event.altKey) return smallStep;
		}
		return step;
	}

	function increment(event: Event): void {
		if (disabled || readOnly) return;
		const amount = resolveStepAmount(event);
		const base = currentValue ?? (min !== undefined ? min - amount : 0);
		writeValue(clamp(base + amount), event, true);
	}

	function decrement(event: Event): void {
		if (disabled || readOnly) return;
		const amount = resolveStepAmount(event);
		const base = currentValue ?? (max !== undefined ? max + amount : 0);
		writeValue(clamp(base - amount), event, true);
	}

	function setInputFocused(focused: boolean): void {
		inputFocused = focused;
	}

	function startScrub(clientX: number, event: PointerEvent, pixelSensitivity = 2): void {
		if (disabled || readOnly) return;
		scrubbing = true;
		scrubStartX = clientX;
		scrubStartValue = currentValue;
		scrubPixelSensitivity = pixelSensitivity;
		scrubPointer = { x: event.clientX, y: event.clientY };
	}

	function moveScrub(clientX: number, event: PointerEvent): void {
		if (!scrubbing || disabled || readOnly) return;
		scrubPointer = { x: event.clientX, y: event.clientY };
		const delta = clientX - scrubStartX;
		const steps = Math.trunc(delta / scrubPixelSensitivity);
		const base = scrubStartValue ?? (min !== undefined ? min : 0);
		writeValue(clamp(base + steps * step), event, true);
	}

	function endScrub(event?: Event): void {
		if (!scrubbing) return;
		scrubbing = false;
		scrubPointer = null;
		if (event) {
			onValueCommitted?.(currentValue, event);
		}
	}

	const canIncrement = $derived(
		!disabled &&
			!readOnly &&
			(max === undefined || (currentValue ?? Number.NEGATIVE_INFINITY) < max),
	);
	const canDecrement = $derived(
		!disabled &&
			!readOnly &&
			(min === undefined || (currentValue ?? Number.POSITIVE_INFINITY) > min),
	);

	$effect(() => {
		if (inputFocused) return;
		const next = currentValue;
		const display = formatDisplay(next);
		if (inputValue !== display) {
			inputValue = display;
		}
	});

	setContext(NUMBER_FIELD_CONTEXT, {
		get value() {
			return currentValue;
		},
		get inputValue() {
			return inputValue;
		},
		setValue,
		setInputValue,
		commitInput,
		increment,
		decrement,
		setInputFocused,
		get scrubbing() {
			return scrubbing;
		},
		startScrub,
		moveScrub,
		endScrub,
		get scrubPointer() {
			return scrubPointer;
		},
		get min() {
			return min;
		},
		get max() {
			return max;
		},
		get step() {
			return step;
		},
		get smallStep() {
			return smallStep;
		},
		get largeStep() {
			return largeStep;
		},
		get disabled() {
			return disabled;
		},
		get readOnly() {
			return readOnly;
		},
		get required() {
			return required;
		},
		get name() {
			return name;
		},
		get form() {
			return form;
		},
		inputId,
		get canIncrement() {
			return canIncrement;
		},
		get canDecrement() {
			return canDecrement;
		},
	} satisfies NumberFieldContext);

	const rootProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			class: className,
			style,
			'data-disabled': disabled ? '' : undefined,
			'data-readonly': readOnly ? '' : undefined,
			'data-scrubbing': scrubbing ? '' : undefined,
		}),
	);
</script>

<div {...rootProps} style={typeof rootProps.style === 'string' ? rootProps.style : undefined}>
	{#if children}
		{@render children({ value: currentValue, disabled })}
	{/if}
	{#if name && !disabled}
		<input
			type="hidden"
			{name}
			{form}
			value={currentValue == null ? '' : String(currentValue)}
			{required}
		/>
	{/if}
</div>
