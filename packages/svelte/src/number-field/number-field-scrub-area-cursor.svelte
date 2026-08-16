<script lang="ts">
	import { getContext } from 'svelte';
	import { NUMBER_FIELD_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { NumberFieldContext, NumberFieldScrubAreaCursorProps } from './types.js';

	let { class: className, style, children, ...rest }: NumberFieldScrubAreaCursorProps = $props();

	const ctx = getContext<NumberFieldContext>(NUMBER_FIELD_CONTEXT);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style: [
				'position:fixed;pointer-events:none;z-index:2147483647;',
				ctx.scrubPointer
					? `left:${ctx.scrubPointer.x}px;top:${ctx.scrubPointer.y}px;transform:translate(-50%,-50%);`
					: undefined,
				typeof style === 'string' ? style : undefined,
			]
				.filter(Boolean)
				.join(';'),
			'aria-hidden': 'true',
			'data-scrubbing': ctx.scrubbing ? '' : undefined,
		}),
	);
</script>

{#if ctx.scrubbing}
	<span
		{...mergedProps}
		style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
	>
		{#if children}
			{@render children()}
		{/if}
	</span>
{/if}
