<script lang="ts">
	import { setContext } from 'svelte';
	import { useId } from '../internal/controllable.svelte.js';
	import { PROGRESS_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { ProgressContext, ProgressRootProps, ProgressStatus } from './types.js';

	let {
		value = null,
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
	}: ProgressRootProps = $props();

	const labelId = useId('progress-label');

	const status: ProgressStatus = $derived(
		value === null ? 'indeterminate' : value >= max ? 'complete' : 'progressing'
	);

	const formattedValue = $derived(
		value === null ? null : new Intl.NumberFormat(locale, format).format(value)
	);

	const ariaValueText = $derived(
		getAriaValueText?.(formattedValue, value) ?? formattedValue ?? undefined
	);

	setContext(PROGRESS_CONTEXT, {
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
		}
	} satisfies ProgressContext);

	const rootProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			role: 'progressbar',
			class: className,
			style,
			'aria-valuemin': min,
			'aria-valuemax': max,
			'aria-valuenow': value === null ? undefined : value,
			'aria-valuetext': ariaValueText,
			'aria-labelledby': labelId,
			'data-complete': status === 'complete' ? '' : undefined,
			'data-indeterminate': status === 'indeterminate' ? '' : undefined,
			'data-progressing': status === 'progressing' ? '' : undefined
		})
	);
</script>

<div {...rootProps}>
	{#if children}
		{@render children()}
	{/if}
</div>
