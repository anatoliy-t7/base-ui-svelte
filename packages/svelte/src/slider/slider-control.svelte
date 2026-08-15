<script lang="ts">
	import { getContext } from 'svelte';
	import { SLIDER_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { SliderContext, SliderControlProps } from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: SliderControlProps = $props();

	const ctx = getContext<SliderContext>(SLIDER_CONTEXT);

	let controlEl: HTMLDivElement | undefined = $state();
	let dragging = $state(false);
	let dragThumbIndex = $state<number | undefined>(undefined);

	function valueFromPointer(clientX: number, clientY: number): number {
		if (!controlEl) return ctx.value;
		const rect = controlEl.getBoundingClientRect();
		let ratio: number;
		if (ctx.orientation === 'horizontal') {
			if (rect.width === 0) {
				ratio = 0;
			} else if (ctx.direction === 'rtl') {
				ratio = (rect.right - clientX) / rect.width;
			} else {
				ratio = (clientX - rect.left) / rect.width;
			}
		} else {
			ratio = rect.height === 0 ? 0 : 1 - (clientY - rect.top) / rect.height;
		}
		ratio = Math.min(1, Math.max(0, ratio));
		return ctx.min + ratio * (ctx.max - ctx.min);
	}

	function onPointerDown(event: PointerEvent): void {
		if (ctx.disabled || event.button !== 0) return;
		const target = event.currentTarget;
		if (!(target instanceof HTMLElement)) return;
		target.setPointerCapture(event.pointerId);
		dragging = true;
		const pointerValue = valueFromPointer(event.clientX, event.clientY);
		const fromThumb = event.target instanceof Element
			? event.target.closest('[role="slider"]')
			: null;
		const preferred =
			fromThumb instanceof HTMLElement && fromThumb.dataset.index != null
				? Number(fromThumb.dataset.index)
				: undefined;
		dragThumbIndex = preferred;
		ctx.setValueFromPointer(pointerValue, event, preferred);
		dragThumbIndex = ctx.activeThumbIndex;
	}

	function onPointerMove(event: PointerEvent): void {
		if (!dragging || ctx.disabled) return;
		ctx.setValueFromPointer(
			valueFromPointer(event.clientX, event.clientY),
			event,
			dragThumbIndex
		);
	}

	function onPointerUp(event: PointerEvent): void {
		if (!dragging) return;
		dragging = false;
		dragThumbIndex = undefined;
		const target = event.currentTarget;
		if (!(target instanceof HTMLElement)) return;
		if (target.hasPointerCapture(event.pointerId)) {
			target.releasePointerCapture(event.pointerId);
		}
	}

	const controlStyle = $derived.by(() => {
		const parts = ['position:relative', 'touch-action:none'];
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

	const controlProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style: controlStyle,
			'data-disabled': ctx.disabled ? '' : undefined,
			'data-orientation': ctx.orientation,
			onpointerdown: onPointerDown,
			onpointermove: onPointerMove,
			onpointerup: onPointerUp,
			onpointercancel: onPointerUp
		})
	);
</script>

<div bind:this={controlEl} {...controlProps}>
	{#if children}
		{@render children()}
	{/if}
</div>
