import { tick, untrack } from 'svelte';

export type PresenceStatus = 'mounted' | 'unmounted' | 'hiding';

export type PresenceOptions = {
	/** Fallback unmount delay when exit animations never finish (ms). @default 500 */
	fallbackMs?: number;
};

/**
 * Keeps content mounted while closed so CSS can animate using
 * `data-open` / `data-closed` and `data-starting-style` / `data-ending-style`.
 *
 * Popup parts should register their host element so exit waits for
 * running animations (via `getAnimations`), or `transitionend` /
 * `animationend` when that API is unavailable:
 *
 * ```ts
 * $effect(() => {
 *   presence.setNode(el);
 *   return () => presence.setNode(null);
 * });
 * ```
 */
export function createPresence(getPresent: () => boolean, options?: PresenceOptions) {
	let status = $state<PresenceStatus>(getPresent() ? 'mounted' : 'unmounted');
	let isStarting = $state(false);
	let node: HTMLElement | null = null;
	let hasBeenPresent = getPresent();

	let startRaf1 = 0;
	let startRaf2 = 0;
	let hideRaf = 0;
	let hideTimeout: ReturnType<typeof setTimeout> | null = null;
	let endListener: ((event: Event) => void) | null = null;
	let animationsGeneration = 0;

	function clearStartRafs(): void {
		if (startRaf1 !== 0) {
			cancelAnimationFrame(startRaf1);
			startRaf1 = 0;
		}
		if (startRaf2 !== 0) {
			cancelAnimationFrame(startRaf2);
			startRaf2 = 0;
		}
	}

	function clearHideRaf(): void {
		if (hideRaf !== 0) {
			cancelAnimationFrame(hideRaf);
			hideRaf = 0;
		}
	}

	function detachEndListeners(): void {
		if (endListener && node) {
			node.removeEventListener('transitionend', endListener);
			node.removeEventListener('animationend', endListener);
		}
		endListener = null;
	}

	function clearHideTimer(): void {
		if (hideTimeout != null) {
			clearTimeout(hideTimeout);
			hideTimeout = null;
		}
	}

	function clearHideSideEffects(): void {
		animationsGeneration += 1;
		clearHideTimer();
		clearHideRaf();
		detachEndListeners();
	}

	function finishHide(): void {
		clearHideSideEffects();
		clearStartRafs();
		isStarting = false;
		status = 'unmounted';
	}

	function attachEndListeners(): void {
		detachEndListeners();
		if (!node) return;

		const onEnd = (event: Event): void => {
			if (event.target !== node) return;
			finishHide();
		};
		endListener = onEnd;
		node.addEventListener('transitionend', onEnd);
		node.addEventListener('animationend', onEnd);
	}

	function waitForAnimations(el: HTMLElement, generation: number): void {
		const animations = el.getAnimations();
		if (animations.length === 0) {
			finishHide();
			return;
		}

		Promise.all(animations.map((animation) => animation.finished)).then(
			() => {
				if (generation !== animationsGeneration || status !== 'hiding') return;
				finishHide();
			},
			() => {
				if (generation !== animationsGeneration || status !== 'hiding') return;
				finishHide();
			},
		);
	}

	/**
	 * After `data-ending-style` is applied, wait one frame so CSS transitions
	 * can start, then unmount immediately when nothing is running (Base UI
	 * `getAnimations` behavior). Falls back to transition/animation events in
	 * environments without `getAnimations` (e.g. happy-dom).
	 */
	function scheduleWaitForExit(): void {
		clearHideRaf();
		detachEndListeners();
		if (!node || status !== 'hiding') return;

		const el = node;
		const generation = animationsGeneration;

		if (typeof el.getAnimations !== 'function') {
			attachEndListeners();
			return;
		}

		hideRaf = requestAnimationFrame(() => {
			hideRaf = 0;
			if (generation !== animationsGeneration || status !== 'hiding' || node !== el) {
				return;
			}
			waitForAnimations(el, generation);
		});
	}

	function beginStarting(): void {
		clearStartRafs();
		isStarting = true;
		startRaf1 = requestAnimationFrame(() => {
			startRaf2 = requestAnimationFrame(() => {
				isStarting = false;
				startRaf1 = 0;
				startRaf2 = 0;
			});
		});
	}

	function beginHiding(): void {
		clearHideSideEffects();
		clearStartRafs();
		isStarting = false;
		status = 'hiding';
		scheduleWaitForExit();
		const ms = options?.fallbackMs ?? 500;
		hideTimeout = setTimeout(() => {
			hideTimeout = null;
			finishHide();
		}, ms);
	}

	$effect(() => {
		const present = getPresent();

		if (present) {
			hasBeenPresent = true;
			untrack(() => {
				clearHideSideEffects();
				status = 'mounted';
				beginStarting();
			});
			return () => {
				untrack(() => clearStartRafs());
			};
		}

		if (!hasBeenPresent) {
			untrack(() => {
				status = 'unmounted';
				isStarting = false;
			});
			return;
		}

		untrack(() => {
			beginHiding();
		});

		return () => {
			untrack(() => {
				clearHideSideEffects();
			});
		};
	});

	function setNode(el: HTMLElement | null): void {
		if (node === el) return;
		detachEndListeners();
		node = el;
		if (status === 'hiding') {
			scheduleWaitForExit();
		}
	}

	function onExitComplete(): void {
		finishHide();
	}

	async function forceMount(): Promise<void> {
		clearHideSideEffects();
		clearStartRafs();
		status = 'mounted';
		isStarting = false;
		await tick();
	}

	return {
		get status() {
			return status;
		},
		get isPresent() {
			return status !== 'unmounted';
		},
		get isVisible() {
			return getPresent() && status === 'mounted';
		},
		get isStarting() {
			return isStarting;
		},
		get isEnding() {
			return status === 'hiding';
		},
		setNode,
		onExitComplete,
		forceMount,
	};
}
