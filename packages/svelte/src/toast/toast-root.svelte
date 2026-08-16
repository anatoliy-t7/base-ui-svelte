<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import { TOAST_CONTEXT } from '../internal/context-keys.js';
	import { createPresence } from '../internal/presence.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { ToastContext, ToastRootProps, ToastSwipeDirection } from './types.js';

	let {
		toast,
		swipeDirection = ['down', 'right'],
		class: className,
		style,
		children,
		...rest
	}: ToastRootProps = $props();

	const parent = getContext<ToastContext>(TOAST_CONTEXT);

	const open = $derived(toast.transitionStatus !== 'ending');
	const presence = createPresence(() => open);

	let rootEl = $state<HTMLElement | null>(null);
	let swipeMovementX = $state(0);
	let swipeMovementY = $state(0);
	let swiping = $state(false);
	let activeSwipeDirection = $state<ToastSwipeDirection | undefined>(undefined);
	let dragStart = { x: 0, y: 0 };
	let activePointerId: number | null = null;

	const swipeDirections = $derived(
		(Array.isArray(swipeDirection) ? swipeDirection : [swipeDirection]).filter(Boolean),
	);
	const swipeEnabled = $derived(swipeDirections.length > 0 && toast.anchor == null);

	const toastIndex = $derived(
		toast.transitionStatus === 'ending'
			? parent.getDomIndex(toast.id)
			: parent.getVisibleIndex(toast.id),
	);
	const toastOffsetY = $derived(parent.getOffsetY(toast.id));
	const expanded = $derived(parent.expanded);
	const limited = $derived(Boolean(toast.limited));

	setContext(TOAST_CONTEXT, {
		get toasts() {
			return parent.toasts;
		},
		get expanded() {
			return parent.expanded;
		},
		get timeout() {
			return parent.timeout;
		},
		get limit() {
			return parent.limit;
		},
		add: (data) => parent.add(data),
		close: (id) => parent.close(id),
		remove: (id) => parent.remove(id),
		update: (id, updates) => parent.update(id, updates),
		updateHeight: (id, height) => parent.updateHeight(id, height),
		promise: (pending, options) => parent.promise(pending, options),
		setHovering: (value) => parent.setHovering(value),
		setFocused: (value) => parent.setFocused(value),
		pauseTimers: () => parent.pauseTimers(),
		resumeTimers: () => parent.resumeTimers(),
		setWindowFocused: (value) => parent.setWindowFocused(value),
		syncOptions: (options) => parent.syncOptions(options),
		getDomIndex: (id) => parent.getDomIndex(id),
		getVisibleIndex: (id) => parent.getVisibleIndex(id),
		getOffsetY: (id) => parent.getOffsetY(id),
		getFrontmostHeight: () => parent.getFrontmostHeight(),
		get toast() {
			return toast;
		},
		get toastIndex() {
			return toastIndex;
		},
		get toastVisibleIndex() {
			return parent.getVisibleIndex(toast.id);
		},
		get toastOffsetY() {
			return toastOffsetY;
		},
		get toastOpen() {
			return open;
		},
		get presenceStarting() {
			return presence.isStarting || toast.transitionStatus === 'starting';
		},
		get presenceEnding() {
			return presence.isEnding || toast.transitionStatus === 'ending';
		},
	} satisfies ToastContext);

	$effect(() => {
		presence.setNode(rootEl);
		return () => presence.setNode(null);
	});

	$effect(() => {
		if (!presence.isPresent && toast.transitionStatus === 'ending') {
			parent.remove(toast.id);
		}
	});

	function measureHeight(): void {
		const el = rootEl;
		if (!el || toast.transitionStatus === 'ending') return;
		const previous = el.style.height;
		el.style.height = 'auto';
		const height = el.offsetHeight;
		el.style.height = previous;
		parent.updateHeight(toast.id, height);
	}

	$effect(() => {
		toast.id;
		toast.transitionStatus;
		toast.title;
		toast.description;
		measureHeight();
	});

	const SWIPE_THRESHOLD = 40;

	function resetSwipe(): void {
		swiping = false;
		swipeMovementX = 0;
		swipeMovementY = 0;
		activePointerId = null;
		activeSwipeDirection = undefined;
	}

	function handlePointerDown(event: PointerEvent): void {
		if (!swipeEnabled || event.button !== 0) return;
		const target = event.target;
		if (
			target instanceof Element &&
			target.closest('button,a,input,textarea,[role="button"],[data-base-ui-swipe-ignore]')
		) {
			return;
		}
		activePointerId = event.pointerId;
		dragStart = { x: event.clientX, y: event.clientY };
		swiping = true;
		activeSwipeDirection = undefined;
		parent.setHovering(true);
		rootEl?.setPointerCapture?.(event.pointerId);
	}

	function handlePointerMove(event: PointerEvent): void {
		if (!swiping || event.pointerId !== activePointerId) return;
		event.preventDefault();
		const deltaX = event.clientX - dragStart.x;
		const deltaY = event.clientY - dragStart.y;
		const absX = Math.abs(deltaX);
		const absY = Math.abs(deltaY);
		const candidate: ToastSwipeDirection =
			absX >= absY ? (deltaX > 0 ? 'right' : 'left') : deltaY > 0 ? 'down' : 'up';
		if (swipeDirections.includes(candidate)) {
			activeSwipeDirection = candidate;
		}
		const allowX = swipeDirections.includes('left') || swipeDirections.includes('right');
		const allowY = swipeDirections.includes('up') || swipeDirections.includes('down');
		swipeMovementX = allowX ? deltaX : 0;
		swipeMovementY = allowY ? deltaY : 0;
	}

	function handlePointerUp(event: PointerEvent): void {
		if (!swiping || event.pointerId !== activePointerId) return;
		let dismiss: ToastSwipeDirection | undefined;
		for (const direction of swipeDirections) {
			const displacement =
				direction === 'left' || direction === 'right'
					? direction === 'right'
						? swipeMovementX
						: -swipeMovementX
					: direction === 'down'
						? swipeMovementY
						: -swipeMovementY;
			if (displacement > SWIPE_THRESHOLD) {
				dismiss = direction;
				break;
			}
		}
		if (dismiss) {
			activeSwipeDirection = dismiss;
			parent.close(toast.id);
			swiping = false;
			activePointerId = null;
			return;
		}
		resetSwipe();
	}

	const cssVars = $derived(
		[
			`--toast-index: ${Math.max(toastIndex, 0)}`,
			`--toast-offset-y: ${toastOffsetY}px`,
			toast.height ? `--toast-height: ${toast.height}px` : '',
			`--toast-swipe-movement-x: ${swipeMovementX}px`,
			`--toast-swipe-movement-y: ${swipeMovementY}px`,
			swiping ? 'transition: none' : '',
		]
			.filter(Boolean)
			.join('; '),
	);

	const mergedStyle = $derived(
		[cssVars, typeof style === 'string' ? style : ''].filter(Boolean).join('; ') || undefined,
	);

	const rootProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			role: toast.priority === 'high' ? 'alertdialog' : 'status',
			tabindex: 0,
			class: className,
			inert: limited ? true : undefined,
			style: mergedStyle,
			'data-open': open ? '' : undefined,
			'data-closed': !open || presence.isEnding ? '' : undefined,
			'data-starting-style':
				presence.isStarting || toast.transitionStatus === 'starting' ? '' : undefined,
			'data-ending-style':
				presence.isEnding || toast.transitionStatus === 'ending' ? '' : undefined,
			'data-expanded': expanded ? '' : undefined,
			'data-limited': limited ? '' : undefined,
			'data-type': toast.type,
			'data-swiping': swiping ? '' : undefined,
			'data-swipe-direction': activeSwipeDirection,
			onpointerdown: handlePointerDown,
			onpointermove: handlePointerMove,
			onpointerup: handlePointerUp,
			onpointercancel: handlePointerUp,
			onkeydown: (event: KeyboardEvent) => {
				if (event.key !== 'Escape') return;
				if (rootEl && document.activeElement && rootEl.contains(document.activeElement)) {
					parent.close(toast.id);
				}
			},
		}),
	);
</script>

{#if presence.isPresent}
	<div
		{...rootProps}
		bind:this={rootEl}
		style={typeof rootProps.style === 'string' ? rootProps.style : undefined}
	>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
