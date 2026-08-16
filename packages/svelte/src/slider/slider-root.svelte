<script lang="ts">
	import { getContext, hasContext, setContext } from 'svelte';
	import { createControllableSliderValue, useId } from '../internal/controllable.svelte.js';
	import { DIRECTION_CONTEXT, SLIDER_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { DirectionContext } from '../direction-provider/types.js';
	import type { SliderContext, SliderRootProps, SliderValue } from './types.js';

	let {
		value = $bindable(undefined),
		defaultValue = 0,
		min = 0,
		max = 100,
		step = 1,
		disabled = false,
		orientation = 'horizontal',
		name,
		format,
		locale,
		onValueChange,
		class: className,
		style,
		id,
		children,
		...rest
	}: SliderRootProps = $props();

	const labelId = useId('slider-label');
	const rootThumbId = useId('slider-thumb');
	const directionContext = hasContext(DIRECTION_CONTEXT)
		? getContext<DirectionContext>(DIRECTION_CONTEXT)
		: undefined;

	let activeThumbIndex = $state(0);
	let nextThumbClaim = $state(0);
	const thumbIds = new Map<number, string>();

	const valueState = createControllableSliderValue({
		getValue: () => value,
		getDefaultValue: () => defaultValue,
		onValueChange: (next, event) => {
			onValueChange?.(next, event);
		},
		setValueProp: (next) => {
			value = next;
		},
	});

	const range = $derived(Array.isArray(valueState.value));

	const values = $derived.by((): number[] => {
		const raw = valueState.value;
		if (Array.isArray(raw)) {
			return raw.map((item) => Math.min(max, Math.max(min, item)));
		}
		return [Math.min(max, Math.max(min, raw))];
	});

	function snap(next: number): number {
		const clamped = Math.min(max, Math.max(min, next));
		if (step <= 0) return clamped;
		const stepped = Math.round((clamped - min) / step) * step + min;
		return Math.min(max, Math.max(min, Number(stepped.toFixed(10))));
	}

	function toOutput(nextValues: number[]): SliderValue {
		return range ? nextValues : nextValues[0]!;
	}

	function setThumbValue(index: number, next: number, event: Event): void {
		if (disabled) return;
		const snapped = snap(next);
		const nextValues = [...values];
		if (index < 0 || index >= nextValues.length) return;

		if (range) {
			const lower = index > 0 ? nextValues[index - 1]! : min;
			const upper = index < nextValues.length - 1 ? nextValues[index + 1]! : max;
			nextValues[index] = Math.min(upper, Math.max(lower, snapped));
		} else {
			nextValues[0] = snapped;
		}

		valueState.setValue(toOutput(nextValues), event);
	}

	function closestThumbIndex(pointerValue: number, preferredIndex?: number): number {
		if (preferredIndex != null && preferredIndex >= 0 && preferredIndex < values.length) {
			return preferredIndex;
		}
		let bestIndex = 0;
		let bestDistance = Number.POSITIVE_INFINITY;
		for (let i = 0; i < values.length; i += 1) {
			const distance = Math.abs(values[i]! - pointerValue);
			if (distance < bestDistance) {
				bestDistance = distance;
				bestIndex = i;
			}
		}
		return bestIndex;
	}

	function setValueFromPointer(pointerValue: number, event: Event, preferredIndex?: number): void {
		if (disabled) return;
		const index = closestThumbIndex(pointerValue, preferredIndex);
		activeThumbIndex = index;
		setThumbValue(index, pointerValue, event);
	}

	function claimThumbIndex(explicit?: number | undefined): number {
		if (explicit != null) {
			nextThumbClaim = Math.max(nextThumbClaim, explicit + 1);
			return explicit;
		}
		const claimed = nextThumbClaim;
		nextThumbClaim += 1;
		return claimed;
	}

	function getThumbId(index: number): string {
		const existing = thumbIds.get(index);
		if (existing) return existing;
		const idValue = index === 0 ? rootThumbId : `${rootThumbId}-${index}`;
		thumbIds.set(index, idValue);
		return idValue;
	}

	function percentageFor(valueAt: number): number {
		return max === min ? 0 : ((valueAt - min) / (max - min)) * 100;
	}

	const percentages = $derived(values.map((item) => percentageFor(item)));
	const percentage = $derived(percentages[0] ?? 0);
	const percentageStart = $derived(range ? Math.min(...percentages) : 0);
	const percentageEnd = $derived(range ? Math.max(...percentages) : percentage);

	const formatter = $derived(new Intl.NumberFormat(locale, format));
	const formattedValues = $derived(values.map((item) => formatter.format(item)));
	const formattedValue = $derived(range ? formattedValues.join(' – ') : (formattedValues[0] ?? ''));

	setContext(SLIDER_CONTEXT, {
		get values() {
			return values;
		},
		get value() {
			return values[0] ?? min;
		},
		get range() {
			return range;
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
		get orientation() {
			return orientation;
		},
		get direction() {
			return directionContext?.direction ?? 'ltr';
		},
		get labelId() {
			return labelId;
		},
		get thumbId() {
			return getThumbId(0);
		},
		get percentage() {
			return percentage;
		},
		get percentages() {
			return percentages;
		},
		get percentageStart() {
			return percentageStart;
		},
		get percentageEnd() {
			return percentageEnd;
		},
		get formattedValue() {
			return formattedValue;
		},
		get formattedValues() {
			return formattedValues;
		},
		get activeThumbIndex() {
			return activeThumbIndex;
		},
		claimThumbIndex,
		getThumbId,
		setActiveThumbIndex: (index: number) => {
			activeThumbIndex = index;
		},
		setThumbValue,
		setValueFromPointer,
	} satisfies SliderContext);

	const rootProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			class: className,
			style,
			dir: directionContext?.direction,
			role: range ? 'group' : undefined,
			'data-disabled': disabled ? '' : undefined,
			'data-orientation': orientation,
		}),
	);
</script>

<div {...rootProps}>
	{#if children}
		{@render children()}
	{/if}
	{#if name && !disabled}
		{#if range}
			{#each values as item, i (i)}
				<input type="hidden" name={`${name}[${i}]`} value={item} />
			{/each}
		{:else}
			<input type="hidden" {name} value={values[0]} />
		{/if}
	{/if}
</div>
