<script lang="ts">
	import { getContext } from 'svelte';
	import { SLIDER_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { SliderContext, SliderIndicatorProps } from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: SliderIndicatorProps = $props();

	const ctx = getContext<SliderContext>(SLIDER_CONTEXT);

	const indicatorStyle = $derived.by(() => {
		const start = ctx.percentageStart;
		const end = ctx.percentageEnd;
		const size = Math.max(0, end - start);
		const parts: string[] = [];
		if (ctx.orientation === 'horizontal') {
			if (ctx.direction === 'rtl') {
				parts.push(`right:${start}%`, `width:${size}%`, 'height:100%');
			} else {
				parts.push(`left:${start}%`, `width:${size}%`, 'height:100%');
			}
		} else {
			parts.push(`bottom:${start}%`, `height:${size}%`, 'width:100%');
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

	const indicatorProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style: indicatorStyle,
			'data-disabled': ctx.disabled ? '' : undefined,
			'data-orientation': ctx.orientation
		})
	);
</script>

<div {...indicatorProps}>
	{#if children}
		{@render children()}
	{/if}
</div>
