<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import { TOAST_CONTEXT, TOAST_POSITIONER_CONTEXT } from '../internal/context-keys.js';
	import { createPositioner } from '../internal/floating.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { ToastContext, ToastPositionerProps } from './types.js';

	let {
		side = 'top',
		align = 'center',
		sideOffset = 8,
		alignOffset = 0,
		collisionPadding = 8,
		collisionBoundary = null,
		collisionAvoidance,
		arrowPadding = 4,
		sticky = false,
		positionMethod,
		anchor: anchorProp = null,
		disableAnchorTracking = false,
		class: className,
		style,
		children,
		...rest
	}: ToastPositionerProps = $props();

	const ctx = getContext<ToastContext>(TOAST_CONTEXT);
	const toastAnchor = $derived(ctx.toast?.anchor ?? null);

	let positionerEl = $state<HTMLElement | null>(null);
	let arrowEl = $state<HTMLElement | null>(null);

	setContext(TOAST_POSITIONER_CONTEXT, {
		get side() {
			return side;
		},
		setArrow(el: HTMLElement | null) {
			arrowEl = el;
		},
	});

	createPositioner({
		get open() {
			return Boolean(anchorProp ?? toastAnchor);
		},
		anchor: () => anchorProp ?? toastAnchor,
		floating: () => positionerEl,
		arrowEl: () => arrowEl,
		get side() {
			return side;
		},
		get align() {
			return align;
		},
		get sideOffset() {
			return sideOffset;
		},
		get alignOffset() {
			return alignOffset;
		},
		get collisionPadding() {
			return collisionPadding;
		},
		get collisionBoundary() {
			return collisionBoundary;
		},
		get collisionAvoidance() {
			return collisionAvoidance;
		},
		get arrowPadding() {
			return arrowPadding;
		},
		get sticky() {
			return sticky;
		},
		get positionMethod() {
			return positionMethod;
		},
		get disableAnchorTracking() {
			return disableAnchorTracking;
		},
	});

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style,
			role: 'presentation',
			'data-anchored': (anchorProp ?? toastAnchor) ? '' : undefined,
			'data-side': side,
		}),
	);
</script>

{#if anchorProp ?? toastAnchor}
	<div
		{...mergedProps}
		bind:this={positionerEl}
		style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
	>
		{#if children}
			{@render children()}
		{/if}
	</div>
{:else if children}
	{@render children()}
{/if}
