import { tick, untrack } from 'svelte';

export type PresenceStatus = 'mounted' | 'unmounted' | 'hiding';

export type PresenceOptions = {
	/** Fallback unmount delay when no transition/animation ends (ms). @default 500 */
	fallbackMs?: number;
};

/**
 * Keeps content mounted while closed so CSS can animate using
 * `data-open` / `data-closed` and `data-starting-style` / `data-ending-style`.
 *
 * Popup parts should register their host element so exit waits for
 * `transitionend` / `animationend`:
 *
 * ```ts
 * $effect(() => {
 *   presence.setNode(el);
 *   return () => presence.setNode(null);
 * });
 * ```
 */
export function createPresence(
	getPresent: () => boolean,
	options?: PresenceOptions
) {
	let status = $state<PresenceStatus>(getPresent() ? 'mounted' : 'unmounted');
	let isStarting = $state(false);
	let node: HTMLElement | null = null;
	let hasBeenPresent = getPresent();

	let startRaf1 = 0;
	let startRaf2 = 0;
	let hideTimeout: ReturnType<typeof setTimeout> | null = null;
	let endListener: ((event: Event) => void) | null = null;

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
		clearHideTimer();
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
		attachEndListeners();
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
			attachEndListeners();
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
		forceMount
	};
}
