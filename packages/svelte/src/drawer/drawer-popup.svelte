<script lang="ts">
	import { getContext, hasContext } from 'svelte';
	import { DRAWER_CONTEXT, DRAWER_VIRTUAL_KEYBOARD_CONTEXT } from '../internal/context-keys.js';
	import { createDismiss } from '../internal/dismiss.svelte.js';
	import { createFocusTrap } from '../internal/focus-trap.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import { createScrollLock } from '../internal/scroll-lock.svelte.js';
	import { dismissSize, resolveSnapFractions } from './swipe-utils.js';
	import type { DrawerContext, DrawerPopupProps, DrawerVirtualKeyboardContext } from './types.js';

	let { render = 'div', class: className, style, children, ...rest }: DrawerPopupProps = $props();

	const ctx = getContext<DrawerContext>(DRAWER_CONTEXT);
	const vk = hasContext(DRAWER_VIRTUAL_KEYBOARD_CONTEXT)
		? getContext<DrawerVirtualKeyboardContext>(DRAWER_VIRTUAL_KEYBOARD_CONTEXT)
		: undefined;

	let popupEl = $state<HTMLElement | null>(null);
	let measuredHeight = $state(0);

	$effect(() => {
		ctx.refs.popup = popupEl;
		return () => {
			if (ctx.refs.popup === popupEl) {
				ctx.refs.popup = null;
			}
		};
	});

	$effect(() => {
		ctx.presence.setNode(popupEl);
		return () => ctx.presence.setNode(null);
	});

	$effect(() => {
		if (!popupEl) {
			measuredHeight = 0;
			return;
		}
		const update = () => {
			if (!popupEl) return;
			measuredHeight = popupEl.getBoundingClientRect().height;
		};
		update();
		const observer = new ResizeObserver(update);
		observer.observe(popupEl);
		return () => observer.disconnect();
	});

	createFocusTrap({
		get enabled() {
			return ctx.open && ctx.modal;
		},
		container: () => ctx.refs.popup,
		restoreFocus: true,
	});

	createScrollLock({
		get enabled() {
			return ctx.open && ctx.modal;
		},
		reference: () => popupEl,
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
		dismissOnOutsidePress: false,
	});

	function onPointerDown(event: PointerEvent): void {
		if (event.button !== 0) return;
		const target = event.target;
		if (!(target instanceof Element)) return;
		// Match Base UI / Toast: don't capture pointer on interactive targets or
		// explicit opt-outs — otherwise clicks (e.g. Drawer.Close) never fire.
		if (
			target.closest(
				'button,a,input,select,textarea,label,[role="button"],[data-base-ui-swipe-ignore]',
			)
		) {
			return;
		}
		// Drawer.Content opts mouse/pen out of dismiss swipes so text selection works.
		if (event.pointerType !== 'touch' && target.closest('[data-base-ui-drawer-content]')) {
			return;
		}
		if (ctx.swiping) return;

		ctx.beginSwipe(event.pointerId, event.clientX, event.clientY, 'dismiss');
		if (popupEl) {
			popupEl.setPointerCapture(event.pointerId);
		}
	}

	function onPointerMove(event: PointerEvent): void {
		if (!ctx.swiping || ctx.swipeMode !== 'dismiss' || !popupEl) return;
		const size = dismissSize(popupEl, ctx.swipeDirection);
		ctx.updateSwipe(event.clientX, event.clientY, event.timeStamp, size);
	}

	function onPointerUp(event: PointerEvent): void {
		if (!ctx.swiping || ctx.swipeMode !== 'dismiss' || !popupEl) return;
		const size = dismissSize(popupEl, ctx.swipeDirection);
		ctx.endSwipe(size);
	}

	function onPointerCancel(): void {
		if (!ctx.swiping || ctx.swipeMode !== 'dismiss') return;
		ctx.cancelSwipe();
	}

	const snapOffset = $derived.by(() => {
		const points = ctx.snapPoints;
		if (!points || points.length === 0 || measuredHeight <= 0) return 0;
		const fractions = resolveSnapFractions(points, measuredHeight);
		const index = Math.min(ctx.activeSnapPointIndex, Math.max(0, fractions.length - 1));
		const fraction = fractions[index] ?? 1;
		return measuredHeight * (1 - fraction);
	});

	const swipeStyle = $derived(
		[
			`--drawer-swipe-movement-x:${ctx.swipeMovementX}px`,
			`--drawer-swipe-movement-y:${ctx.swipeMovementY}px`,
			`--drawer-swipe-progress:${ctx.swipeProgress}`,
			`--drawer-swipe-strength:${ctx.swipeStrength}`,
			measuredHeight > 0 ? `--drawer-height:${measuredHeight}px` : undefined,
			ctx.snapPoints && ctx.snapPoints.length > 0
				? `--drawer-snap-point-offset:${snapOffset}px`
				: undefined,
			vk ? `--drawer-keyboard-inset:${vk.keyboardInset}px` : undefined,
			typeof style === 'string' ? style : undefined,
		]
			.filter(Boolean)
			.join(';'),
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
			'data-closed': !ctx.open || ctx.presence.isEnding ? '' : undefined,
			'data-starting-style': ctx.presence.isStarting ? '' : undefined,
			'data-ending-style': ctx.presence.isEnding ? '' : undefined,
			'data-swipe-direction': ctx.swipeDirection,
			'data-swiping': ctx.swiping ? '' : undefined,
			'data-swipe-snap':
				!ctx.swiping && ctx.snapPoints && ctx.snapPoints.length > 0 ? '' : undefined,
			onpointerdown: onPointerDown,
			onpointermove: onPointerMove,
			onpointerup: onPointerUp,
			onpointercancel: onPointerCancel,
		}),
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
