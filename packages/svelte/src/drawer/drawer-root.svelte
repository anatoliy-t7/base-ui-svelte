<script lang="ts">
	import { getContext, hasContext, onDestroy, setContext, untrack } from 'svelte';
	import {
		createControllableOpen,
		useId
	} from '../internal/controllable.svelte.js';
	import { DRAWER_CONTEXT, DRAWER_PROVIDER_CONTEXT } from '../internal/context-keys.js';
	import { createPresence } from '../internal/presence.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import {
		applySwipeResistance,
		axisDelta,
		DISMISS_PROGRESS,
		nearestSnapIndex,
		OPEN_PROGRESS,
		resolveSnapFractions,
		signedMovement,
		swipeStrength,
		VELOCITY_THRESHOLD
	} from './swipe-utils.js';
	import type {
		DrawerContext,
		DrawerProviderContext,
		DrawerRefs,
		DrawerRootProps,
		DrawerSwipeMode,
		DrawerSwipeVisual
	} from './types.js';
	import type { OpenChangeReason } from '../internal/controllable.svelte.js';

	let {
		open = $bindable(undefined),
		defaultOpen = false,
		onOpenChange,
		swipeDirection = 'down',
		modal = true,
		disablePointerDismissal = false,
		snapPoints,
		class: className,
		style,
		id = useId('drawer'),
		children,
		...rest
	}: DrawerRootProps = $props();

	const provider = hasContext(DRAWER_PROVIDER_CONTEXT)
		? getContext<DrawerProviderContext>(DRAWER_PROVIDER_CONTEXT)
		: undefined;

	const resolvedSwipeDirection = $derived(swipeDirection ?? provider?.swipeDirection ?? 'down');

	const openState = createControllableOpen({
		getOpen: () => open,
		getDefaultOpen: () => defaultOpen,
		onOpenChange: (next, eventDetails) => {
			onOpenChange?.(next, eventDetails);
		},
		setOpenProp: (next) => {
			open = next;
		}
	});

	const presence = createPresence(() => openState.open);

	const refs: DrawerRefs = {
		trigger: null,
		popup: null
	};

	const triggerId = useId('drawer-trigger');
	const titleId = useId('drawer-title');
	const descriptionId = useId('drawer-description');
	const popupId = useId('drawer-popup');

	let unregisterOpen: (() => void) | undefined;
	let activeSnapPointIndex = $state(0);
	let swipeProgress = $state(0);
	let swipeMovementX = $state(0);
	let swipeMovementY = $state(0);
	let swipeStrengthValue = $state(1);
	let swiping = $state(false);
	let swipeMode = $state<DrawerSwipeMode | null>(null);

	let pointerId: number | null = null;
	let startX = 0;
	let startY = 0;
	let lastX = 0;
	let lastY = 0;
	let lastTime = 0;
	let velocity = 0;
	let snapAnchorFraction = 1;

	function syncProviderRegistration(nextOpen: boolean): void {
		if (!provider) return;
		if (nextOpen) {
			if (!unregisterOpen) {
				unregisterOpen = provider.registerOpen();
			}
			return;
		}
		unregisterOpen?.();
		unregisterOpen = undefined;
	}

	function setOpen(next: boolean, reason: OpenChangeReason): void {
		openState.setOpen(next, reason);
	}

	function setActiveSnapPointIndex(index: number): void {
		activeSnapPointIndex = Math.max(0, index);
	}

	function resetSwipeVisual(): void {
		swipeProgress = 0;
		swipeMovementX = 0;
		swipeMovementY = 0;
		swipeStrengthValue = 1;
		swiping = false;
		swipeMode = null;
		pointerId = null;
		velocity = 0;
	}

	function setSwipeVisual(visual: DrawerSwipeVisual | null): void {
		if (!visual) {
			resetSwipeVisual();
			return;
		}
		swipeProgress = visual.progress;
		swipeMovementX = visual.movementX;
		swipeMovementY = visual.movementY;
		swipeStrengthValue = visual.strength;
	}

	function beginSwipe(
		nextPointerId: number,
		nextStartX: number,
		nextStartY: number,
		mode: DrawerSwipeMode
	): void {
		pointerId = nextPointerId;
		startX = nextStartX;
		startY = nextStartY;
		lastX = nextStartX;
		lastY = nextStartY;
		lastTime = performance.now();
		velocity = 0;
		swiping = true;
		swipeMode = mode;
		swipeProgress = 0;
		swipeMovementX = 0;
		swipeMovementY = 0;
		swipeStrengthValue = 1;

		const size = Math.max(
			refs.popup
				? Math.max(
						resolvedSwipeDirection === 'left' || resolvedSwipeDirection === 'right'
							? refs.popup.getBoundingClientRect().width
							: refs.popup.getBoundingClientRect().height,
						1
					)
				: typeof window !== 'undefined'
					? window.innerHeight
					: 1,
			1
		);
		const fractions = resolveSnapFractions(snapPoints, size);
		if (fractions.length > 0) {
			const index = Math.min(activeSnapPointIndex, fractions.length - 1);
			snapAnchorFraction = fractions[index] ?? 1;
		} else {
			snapAnchorFraction = mode === 'open' ? 0 : 1;
		}

		if (mode === 'open' && !openState.open) {
			setOpen(true, 'trigger-press');
		}
	}

	function updateSwipe(
		clientX: number,
		clientY: number,
		timeStamp: number,
		size: number
	): void {
		if (!swiping || pointerId === null) return;

		const direction = resolvedSwipeDirection;
		const dx = clientX - startX;
		const dy = clientY - startY;
		const rawAxis = axisDelta(direction, dx, dy);

		const dt = timeStamp - lastTime;
		if (dt > 0) {
			const moveDelta = axisDelta(direction, clientX - lastX, clientY - lastY);
			velocity = moveDelta / dt;
		}
		lastX = clientX;
		lastY = clientY;
		lastTime = timeStamp;

		const safeSize = Math.max(size, 1);

		if (swipeMode === 'open') {
			// Open gesture moves opposite to dismiss direction.
			const openRaw = -rawAxis;
			const { delta, progress } = applySwipeResistance(openRaw, safeSize);
			const movement = signedMovement(direction, -delta);
			swipeMovementX = movement.movementX;
			swipeMovementY = movement.movementY;
			swipeProgress = progress;
			swipeStrengthValue = swipeStrength(progress);
			return;
		}

		const fractions = resolveSnapFractions(snapPoints, safeSize);
		if (fractions.length > 0) {
			const dragFraction = rawAxis / safeSize;
			const nextFraction = Math.min(1, Math.max(0, snapAnchorFraction - dragFraction));
			const dismissProgress = Math.max(0, snapAnchorFraction - nextFraction);
			const { delta, progress } = applySwipeResistance(
				dismissProgress * safeSize,
				safeSize
			);
			const movement = signedMovement(direction, delta);
			swipeMovementX = movement.movementX;
			swipeMovementY = movement.movementY;
			swipeProgress = progress;
			swipeStrengthValue = swipeStrength(progress);
			return;
		}

		const { delta, progress } = applySwipeResistance(rawAxis, safeSize);
		const movement = signedMovement(direction, delta);
		swipeMovementX = movement.movementX;
		swipeMovementY = movement.movementY;
		swipeProgress = progress;
		swipeStrengthValue = swipeStrength(progress);
	}

	function endSwipe(size: number): void {
		if (!swiping) return;

		const safeSize = Math.max(size, 1);
		const fractions = resolveSnapFractions(snapPoints, safeSize);
		const mode = swipeMode;
		const progress = swipeProgress;
		const currentVelocity = velocity;

		resetSwipeVisual();

		if (mode === 'open') {
			const isTap = progress < 0.05 && Math.abs(currentVelocity) < VELOCITY_THRESHOLD;
			const shouldOpen =
				isTap || progress > OPEN_PROGRESS || currentVelocity < -VELOCITY_THRESHOLD;
			if (shouldOpen) {
				if (fractions.length > 0) {
					setActiveSnapPointIndex(fractions.length - 1);
				}
				setOpen(true, 'imperative-action');
			} else {
				setOpen(false, 'imperative-action');
			}
			return;
		}

		if (fractions.length > 0) {
			const dragFraction = progress;
			const tentative = Math.min(1, Math.max(0, snapAnchorFraction - dragFraction));
			const towardClosed =
				currentVelocity > VELOCITY_THRESHOLD ||
				tentative < (fractions[0] ?? 0) / 2 ||
				(tentative <= (fractions[0] ?? 0) && progress > DISMISS_PROGRESS);

			if (towardClosed && (progress > DISMISS_PROGRESS || currentVelocity > VELOCITY_THRESHOLD)) {
				setActiveSnapPointIndex(0);
				setOpen(false, 'imperative-action');
				return;
			}

			const nextIndex = nearestSnapIndex(fractions, tentative);
			setActiveSnapPointIndex(nextIndex);
			setOpen(true, 'imperative-action');
			return;
		}

		const shouldDismiss = progress > DISMISS_PROGRESS || currentVelocity > VELOCITY_THRESHOLD;
		if (shouldDismiss) {
			setOpen(false, 'imperative-action');
		}
	}

	function cancelSwipe(): void {
		resetSwipeVisual();
	}

	$effect(() => {
		const nextOpen = openState.open;
		untrack(() => {
			syncProviderRegistration(nextOpen);
		});
	});

	$effect(() => {
		const points = snapPoints;
		if (!points || points.length === 0) {
			activeSnapPointIndex = 0;
			return;
		}
		if (activeSnapPointIndex > points.length - 1) {
			activeSnapPointIndex = points.length - 1;
		}
	});

	onDestroy(() => {
		unregisterOpen?.();
		unregisterOpen = undefined;
	});

	setContext(DRAWER_CONTEXT, {
		get open() {
			return openState.open;
		},
		setOpen,
		get swipeDirection() {
			return resolvedSwipeDirection;
		},
		get modal() {
			return modal;
		},
		get disablePointerDismissal() {
			return disablePointerDismissal;
		},
		get snapPoints() {
			return snapPoints;
		},
		get activeSnapPointIndex() {
			return activeSnapPointIndex;
		},
		setActiveSnapPointIndex,
		get swipeProgress() {
			return swipeProgress;
		},
		get swipeMovementX() {
			return swipeMovementX;
		},
		get swipeMovementY() {
			return swipeMovementY;
		},
		get swipeStrength() {
			return swipeStrengthValue;
		},
		get swiping() {
			return swiping;
		},
		get swipeMode() {
			return swipeMode;
		},
		setSwipeVisual,
		beginSwipe,
		updateSwipe,
		endSwipe,
		cancelSwipe,
		triggerId,
		titleId,
		descriptionId,
		popupId,
		refs,
		presence
	} satisfies DrawerContext);

	const rootProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			class: className,
			style,
			'data-open': openState.open ? '' : undefined,
			'data-closed': !openState.open ? '' : undefined,
			'data-swipe-direction': resolvedSwipeDirection,
			'data-swiping': swiping ? '' : undefined
		})
	);
</script>

<div {...rootProps} style={typeof rootProps.style === 'string' ? rootProps.style : undefined}>
	{#if children}
		{@render children({ open: openState.open })}
	{/if}
</div>
