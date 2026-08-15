<script lang="ts">
	import { getContext } from 'svelte';
	import { DRAWER_CONTEXT } from '../internal/context-keys.js';
	import { createDismiss } from '../internal/dismiss.svelte.js';
	import { createFocusTrap } from '../internal/focus-trap.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { DrawerContext, DrawerPopupProps, DrawerSwipeDirection } from './types.js';

	let {
		render = 'div',
		class: className,
		style,
		children,
		...rest
	}: DrawerPopupProps = $props();

	const ctx = getContext<DrawerContext>(DRAWER_CONTEXT);

	let popupEl = $state<HTMLElement | null>(null);
	let swiping = $state(false);
	let movementX = $state(0);
	let movementY = $state(0);
	let progress = $state(0);

	let pointerId: number | null = null;
	let startX = 0;
	let startY = 0;
	let lastX = 0;
	let lastY = 0;
	let lastTime = 0;
	let velocity = 0;

	const DISMISS_PROGRESS = 0.3;
	const VELOCITY_THRESHOLD = 0.5;

	$effect(() => {
		ctx.refs.popup = popupEl;
		return () => {
			if (ctx.refs.popup === popupEl) {
				ctx.refs.popup = null;
			}
		};
	});

	createFocusTrap({
		get enabled() {
			return ctx.open && ctx.modal;
		},
		container: () => ctx.refs.popup,
		restoreFocus: true
	});

	createDismiss({
		get enabled() {
			return ctx.open;
		},
		refs: () => [ctx.refs.popup, ctx.refs.trigger],
		onDismiss: (event) => {
			const reason = event instanceof KeyboardEvent ? 'escape-key' : 'outside-press';
			if (reason === 'outside-press' && ctx.disablePointerDismissal) return;
			ctx.setOpen(false, reason);
		},
		dismissOnEscape: true,
		dismissOnOutsidePress: false
	});

	function axisDelta(direction: DrawerSwipeDirection, dx: number, dy: number): number {
		switch (direction) {
			case 'down':
				return Math.max(0, dy);
			case 'up':
				return Math.max(0, -dy);
			case 'right':
				return Math.max(0, dx);
			case 'left':
				return Math.max(0, -dx);
		}
	}

	function dismissSize(el: HTMLElement, direction: DrawerSwipeDirection): number {
		const rect = el.getBoundingClientRect();
		const size =
			direction === 'left' || direction === 'right' ? rect.width : rect.height;
		return Math.max(size, 1);
	}

	function resetSwipe(): void {
		swiping = false;
		movementX = 0;
		movementY = 0;
		progress = 0;
		pointerId = null;
		velocity = 0;
	}

	function onPointerDown(event: PointerEvent): void {
		if (event.button !== 0) return;
		const target = event.target;
		if (!(target instanceof Element)) return;
		if (target.closest('[data-base-ui-swipe-ignore]')) return;

		pointerId = event.pointerId;
		startX = event.clientX;
		startY = event.clientY;
		lastX = event.clientX;
		lastY = event.clientY;
		lastTime = event.timeStamp;
		velocity = 0;
		swiping = true;
		movementX = 0;
		movementY = 0;
		progress = 0;

		if (popupEl) {
			popupEl.setPointerCapture(event.pointerId);
		}
	}

	function onPointerMove(event: PointerEvent): void {
		if (!swiping || event.pointerId !== pointerId || !popupEl) return;

		const dx = event.clientX - startX;
		const dy = event.clientY - startY;
		const direction = ctx.swipeDirection;
		const delta = axisDelta(direction, dx, dy);
		const size = dismissSize(popupEl, direction);

		const dt = event.timeStamp - lastTime;
		if (dt > 0) {
			const moveDelta = axisDelta(
				direction,
				event.clientX - lastX,
				event.clientY - lastY
			);
			velocity = moveDelta / dt;
		}
		lastX = event.clientX;
		lastY = event.clientY;
		lastTime = event.timeStamp;

		movementX = direction === 'left' || direction === 'right' ? (direction === 'left' ? -delta : delta) : 0;
		movementY = direction === 'up' || direction === 'down' ? (direction === 'up' ? -delta : delta) : 0;
		progress = Math.min(1, delta / size);
	}

	function onPointerUp(event: PointerEvent): void {
		if (!swiping || event.pointerId !== pointerId) return;

		const shouldDismiss = progress > DISMISS_PROGRESS || velocity > VELOCITY_THRESHOLD;
		if (shouldDismiss) {
			resetSwipe();
			ctx.setOpen(false, 'imperative-action');
			return;
		}

		resetSwipe();
	}

	function onPointerCancel(event: PointerEvent): void {
		if (event.pointerId !== pointerId) return;
		resetSwipe();
	}

	const swipeStyle = $derived(
		[
			`--drawer-swipe-movement-x:${movementX}px`,
			`--drawer-swipe-movement-y:${movementY}px`,
			`--drawer-swipe-progress:${progress}`,
			typeof style === 'string' ? style : undefined
		]
			.filter(Boolean)
			.join(';')
	);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id: ctx.popupId,
			role: 'dialog',
			class: className,
			style: swipeStyle,
			tabindex: -1,
			'aria-modal': ctx.modal ? 'true' : undefined,
			'aria-labelledby': ctx.titleId,
			'aria-describedby': ctx.descriptionId,
			'data-open': ctx.open ? '' : undefined,
			'data-closed': !ctx.open ? '' : undefined,
			'data-swipe-direction': ctx.swipeDirection,
			'data-swiping': swiping ? '' : undefined,
			onpointerdown: onPointerDown,
			onpointermove: onPointerMove,
			onpointerup: onPointerUp,
			onpointercancel: onPointerCancel
		})
	);
</script>

{#if ctx.presence.isPresent}
	<svelte:element
		this={render}
		{...mergedProps}
		bind:this={popupEl}
		style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
	>
		{#if children}
			{@render children()}
		{/if}
	</svelte:element>
{/if}
