<script lang="ts">
	import { setContext } from 'svelte';
	import { useId } from '../internal/controllable.svelte.js';
	import { NUMBER_FIELD_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { NumberFieldContext, NumberFieldRootProps } from './types.js';

	let {
		value = $bindable(undefined),
		defaultValue = null,
		onValueChange,
		min,
		max,
		step = 1,
		disabled = false,
		name,
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
	const currentValue = $derived(
		value !== undefined ? value : (uncontrolledValue ?? defaultValue)
	);

	const inputId = useId('number-field-input');

	function clamp(next: number): number {
		let result = next;
		if (min !== undefined) result = Math.max(min, result);
		if (max !== undefined) result = Math.min(max, result);
		if (step > 0 && min !== undefined) {
			const stepped = Math.round((result - min) / step) * step + min;
			result = Number(stepped.toFixed(10));
			if (min !== undefined) result = Math.max(min, result);
			if (max !== undefined) result = Math.min(max, result);
		}
		return result;
	}

	function parseNumber(raw: string): number | null {
		const trimmed = raw.trim();
		if (trimmed === '' || trimmed === '-' || trimmed === '+' || trimmed === '.') {
			return null;
		}
		const parsed = Number(trimmed);
		return Number.isFinite(parsed) ? parsed : null;
	}

	function syncInputFromValue(next: number | null): void {
		inputValue = next == null ? '' : String(next);
	}

	function writeValue(next: number | null, event: Event, syncInput: boolean): void {
		if (disabled) return;
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
		if (disabled) return;
		inputValue = next;
		if (!event) return;
		const trimmed = next.trim();
		if (trimmed === '' || trimmed === '-' || trimmed === '+' || trimmed === '.') {
			writeValue(null, event, false);
			return;
		}
		const parsed = Number(trimmed);
		if (Number.isFinite(parsed)) {
			writeValue(parsed, event, false);
		}
	}

	function commitInput(event: Event): void {
		if (disabled) return;
		const parsed = parseNumber(inputValue);
		if (parsed == null) {
			writeValue(null, event, true);
			return;
		}
		writeValue(clamp(parsed), event, true);
	}

	function increment(event: Event): void {
		if (disabled) return;
		const base = currentValue ?? (min !== undefined ? min - step : 0);
		writeValue(clamp(base + step), event, true);
	}

	function decrement(event: Event): void {
		if (disabled) return;
		const base = currentValue ?? (max !== undefined ? max + step : 0);
		writeValue(clamp(base - step), event, true);
	}

	function setInputFocused(focused: boolean): void {
		inputFocused = focused;
	}

	function startScrub(clientX: number, event: PointerEvent, pixelSensitivity = 2): void {
		if (disabled) return;
		scrubbing = true;
		scrubStartX = clientX;
		scrubStartValue = currentValue;
		scrubPixelSensitivity = pixelSensitivity;
		scrubPointer = { x: event.clientX, y: event.clientY };
	}

	function moveScrub(clientX: number, event: PointerEvent): void {
		if (!scrubbing || disabled) return;
		scrubPointer = { x: event.clientX, y: event.clientY };
		const delta = clientX - scrubStartX;
		const steps = Math.trunc(delta / scrubPixelSensitivity);
		const base = scrubStartValue ?? (min !== undefined ? min : 0);
		writeValue(clamp(base + steps * step), event, true);
	}

	function endScrub(): void {
		scrubbing = false;
		scrubPointer = null;
	}

	const canIncrement = $derived(
		!disabled && (max === undefined || (currentValue ?? Number.NEGATIVE_INFINITY) < max)
	);
	const canDecrement = $derived(
		!disabled && (min === undefined || (currentValue ?? Number.POSITIVE_INFINITY) > min)
	);

	$effect(() => {
		if (inputFocused) return;
		const next = currentValue;
		const display = next == null ? '' : String(next);
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
		get disabled() {
			return disabled;
		},
		get required() {
			return required;
		},
		get name() {
			return name;
		},
		inputId,
		get canIncrement() {
			return canIncrement;
		},
		get canDecrement() {
			return canDecrement;
		}
	} satisfies NumberFieldContext);

	const rootProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			class: className,
			style,
			'data-disabled': disabled ? '' : undefined,
			'data-scrubbing': scrubbing ? '' : undefined
		})
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
			value={currentValue == null ? '' : String(currentValue)}
			{required}
		/>
	{/if}
</div>
