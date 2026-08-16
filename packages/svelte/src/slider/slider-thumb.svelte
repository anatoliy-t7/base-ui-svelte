<script lang="ts">
	import { getContext, untrack } from 'svelte';
	import { SLIDER_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { SliderContext, SliderThumbProps } from './types.js';

	let { index: indexProp, class: className, style, children, ...rest }: SliderThumbProps = $props();

	const ctx = getContext<SliderContext>(SLIDER_CONTEXT);
	// Claim once for the thumb lifetime; explicit `index` supports SSR for range sliders.
	const index = untrack(() => ctx.claimThumbIndex(indexProp));

	function onKeyDown(event: KeyboardEvent): void {
		if (ctx.disabled) return;

		const rtl = ctx.direction === 'rtl' && ctx.orientation === 'horizontal';
		const increaseKeys = rtl
			? new Set(['ArrowLeft', 'ArrowUp'])
			: new Set(['ArrowRight', 'ArrowUp']);
		const decreaseKeys = rtl
			? new Set(['ArrowRight', 'ArrowDown'])
			: new Set(['ArrowLeft', 'ArrowDown']);

		const current = ctx.values[index] ?? ctx.min;
		let next: number | undefined;

		if (increaseKeys.has(event.key)) {
			next = current + ctx.step;
		} else if (decreaseKeys.has(event.key)) {
			next = current - ctx.step;
		} else if (event.key === 'Home') {
			next = ctx.min;
		} else if (event.key === 'End') {
			next = ctx.max;
		} else if (event.key === 'PageUp') {
			next = current + ctx.step * 10;
		} else if (event.key === 'PageDown') {
			next = current - ctx.step * 10;
		} else {
			return;
		}

		event.preventDefault();
		ctx.setActiveThumbIndex(index);
		ctx.setThumbValue(index, next, event);
	}

	const thumbPercentage = $derived(ctx.percentages[index] ?? 0);

	const thumbStyle = $derived.by(() => {
		const parts: string[] = [];
		if (ctx.orientation === 'horizontal') {
			if (ctx.direction === 'rtl') {
				parts.push(`right:${thumbPercentage}%`);
			} else {
				parts.push(`left:${thumbPercentage}%`);
			}
		} else {
			parts.push(`bottom:${thumbPercentage}%`);
		}
		if (typeof style === 'string' && style.length > 0) {
			parts.push(style);
		} else if (typeof style === 'object' && style !== null) {
			for (const [key, value] of Object.entries(style)) {
				if (value != null && value !== '') {
					parts.push(`${key}:${value}`);
				}
			}
		}
		return parts.join(';');
	});

	const thumbProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id: ctx.getThumbId(index),
			role: 'slider',
			tabindex: ctx.disabled ? undefined : 0,
			class: className,
			style: thumbStyle,
			'aria-valuemin': ctx.min,
			'aria-valuemax': ctx.max,
			'aria-valuenow': ctx.values[index] ?? ctx.min,
			'aria-orientation': ctx.orientation,
			'aria-labelledby': ctx.labelId,
			'aria-disabled': ctx.disabled ? true : undefined,
			'data-disabled': ctx.disabled ? '' : undefined,
			'data-orientation': ctx.orientation,
			'data-index': index,
			onfocus: () => {
				ctx.setActiveThumbIndex(index);
			},
			onkeydown: onKeyDown,
		}),
	);
</script>

<span {...thumbProps}>
	{#if children}
		{@render children()}
	{/if}
</span>
