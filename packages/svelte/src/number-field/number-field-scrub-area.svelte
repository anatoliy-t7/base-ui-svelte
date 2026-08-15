<script lang="ts">
	import { getContext } from 'svelte';
	import { NUMBER_FIELD_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { NumberFieldContext, NumberFieldScrubAreaProps } from './types.js';

	let {
		pixelSensitivity = 2,
		class: className,
		style,
		children,
		...rest
	}: NumberFieldScrubAreaProps = $props();

	const ctx = getContext<NumberFieldContext>(NUMBER_FIELD_CONTEXT);

	function handlePointerDown(event: PointerEvent): void {
		if (ctx.disabled) return;
		const isMainButton = !event.button || event.button === 0;
		if (!isMainButton) return;
		ctx.startScrub(event.clientX, event, pixelSensitivity);
		try {
			(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
		} catch {
			// happy-dom / some environments may not support pointer capture
		}
	}

	function handlePointerMove(event: PointerEvent): void {
		if (!ctx.scrubbing) return;
		ctx.moveScrub(event.clientX, event);
	}

	function handlePointerUp(): void {
		ctx.endScrub();
	}

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style,
			'data-disabled': ctx.disabled ? '' : undefined,
			'data-scrubbing': ctx.scrubbing ? '' : undefined
		})
	);
</script>

<div
	{...mergedProps}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
	onpointerdown={handlePointerDown}
	onpointermove={handlePointerMove}
	onpointerup={handlePointerUp}
	onpointercancel={handlePointerUp}
>
	{#if children}
		{@render children()}
	{/if}
</div>
