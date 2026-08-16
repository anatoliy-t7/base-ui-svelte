<script lang="ts">
	import { setContext } from 'svelte';
	import { useId } from '../internal/controllable.svelte.js';
	import { METER_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { MeterContext, MeterRootProps, MeterStatus } from './types.js';

	let {
		value,
		min = 0,
		max = 100,
		format,
		getAriaValueText,
		locale,
		class: className,
		style,
		id,
		children,
		...rest
	}: MeterRootProps = $props();

	const labelId = useId('meter-label');

	const status: MeterStatus = $derived(value >= max ? 'complete' : 'progressing');

	const formattedValue = $derived(new Intl.NumberFormat(locale, format).format(value));

	const ariaValueText = $derived(getAriaValueText?.(formattedValue, value) ?? formattedValue);

	setContext(METER_CONTEXT, {
		get value() {
			return value;
		},
		get min() {
			return min;
		},
		get max() {
			return max;
		},
		get status() {
			return status;
		},
		get formattedValue() {
			return formattedValue;
		},
		get labelId() {
			return labelId;
		},
	} satisfies MeterContext);

	const rootProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			role: 'meter',
			class: className,
			style,
			'aria-valuemin': min,
			'aria-valuemax': max,
			'aria-valuenow': value,
			'aria-valuetext': ariaValueText,
			'aria-labelledby': labelId,
			'data-complete': status === 'complete' ? '' : undefined,
			'data-progressing': status === 'progressing' ? '' : undefined,
		}),
	);
</script>

<div {...rootProps}>
	{#if children}
		{@render children()}
	{/if}
</div>
