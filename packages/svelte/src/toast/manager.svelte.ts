import { SvelteMap } from 'svelte/reactivity';
import type { HTMLButtonAttributes } from 'svelte/elements';

export type ToastActionPropsData = Omit<HTMLButtonAttributes, 'children'> & {
	children?: string | undefined;
};

export type ToastTransitionStatus = 'starting' | 'ending';

export type ToastData = {
	readonly id: string;
	readonly title?: string | undefined;
	readonly description?: string | undefined;
	readonly timeout?: number | undefined;
	readonly type?: string | undefined;
	readonly priority?: 'low' | 'high' | undefined;
	readonly limited?: boolean | undefined;
	readonly height?: number | undefined;
	readonly transitionStatus?: ToastTransitionStatus | undefined;
	readonly updateKey?: number | undefined;
	readonly actionProps?: ToastActionPropsData | undefined;
	readonly anchor?: HTMLElement | null | undefined;
	readonly onClose?: (() => void) | undefined;
	readonly onRemove?: (() => void) | undefined;
};

export type ToastAddInput = {
	id?: string | undefined;
	title?: string | undefined;
	description?: string | undefined;
	timeout?: number | undefined;
	type?: string | undefined;
	priority?: 'low' | 'high' | undefined;
	actionProps?: ToastActionPropsData | undefined;
	anchor?: HTMLElement | null | undefined;
	onClose?: (() => void) | undefined;
	onRemove?: (() => void) | undefined;
};

export type ToastUpdateInput = {
	title?: string | undefined;
	description?: string | undefined;
	timeout?: number | undefined;
	type?: string | undefined;
	priority?: 'low' | 'high' | undefined;
	actionProps?: ToastActionPropsData | undefined;
	anchor?: HTMLElement | null | undefined;
	onClose?: (() => void) | undefined;
	onRemove?: (() => void) | undefined;
	height?: number | undefined;
	transitionStatus?: ToastTransitionStatus | undefined;
	limited?: boolean | undefined;
};

export type ToastManagerOptions = {
	timeout?: number | undefined;
	limit?: number | undefined;
};

export type ToastPromiseOptions<Value> = {
	loading: string | ToastUpdateInput;
	success: string | ToastUpdateInput | ((result: Value) => string | ToastUpdateInput);
	error: string | ToastUpdateInput | ((error: unknown) => string | ToastUpdateInput);
};

export type ToastManager = {
	readonly toasts: ToastData[];
	readonly expanded: boolean;
	readonly timeout: number;
	readonly limit: number;
	add: (data: ToastAddInput) => string;
	close: (id?: string) => void;
	remove: (id: string) => void;
	update: (id: string, updates: ToastUpdateInput) => void;
	updateHeight: (id: string, height: number) => void;
	promise: <Value>(promise: Promise<Value>, options: ToastPromiseOptions<Value>) => Promise<Value>;
	setHovering: (value: boolean) => void;
	setFocused: (value: boolean) => void;
	pauseTimers: () => void;
	resumeTimers: () => void;
	setWindowFocused: (value: boolean) => void;
	syncOptions: (options: ToastManagerOptions) => void;
	getDomIndex: (id: string) => number;
	getVisibleIndex: (id: string) => number;
	getOffsetY: (id: string) => number;
	getFrontmostHeight: () => number | undefined;
};

type ToastMetadata = {
	domIndex: number;
	visibleIndex: number;
	offsetY: number;
};

type TimerInfo = {
	handle: number | undefined;
	start: number;
	delay: number;
	remaining: number;
};

let toastIdCounter = 0;

function nextToastId(): string {
	toastIdCounter += 1;
	return `toast-${toastIdCounter}`;
}

function applyLimited(toasts: ToastData[], limit: number): ToastData[] {
	let activeIndex = 0;
	return toasts.map((toast) => {
		if (toast.transitionStatus === 'ending') {
			return toast;
		}
		const limited = activeIndex >= limit;
		activeIndex += 1;
		return toast.limited === limited ? toast : { ...toast, limited };
	});
}

function createMetadata(toasts: ToastData[]): Map<string, ToastMetadata> {
	const metadata = new Map<string, ToastMetadata>();
	let visibleIndex = 0;
	let offsetY = 0;

	toasts.forEach((toast, toastIndex) => {
		const isEnding = toast.transitionStatus === 'ending';
		metadata.set(toast.id, {
			domIndex: toastIndex,
			visibleIndex: isEnding ? -1 : visibleIndex,
			offsetY,
		});
		offsetY += toast.height ?? 0;
		if (!isEnding) {
			visibleIndex += 1;
		}
	});

	return metadata;
}

export function createToastManager(options: ToastManagerOptions = {}): ToastManager {
	let toasts = $state<ToastData[]>([]);
	let timeout = $state(options.timeout ?? 5000);
	let limit = $state(options.limit ?? 3);
	let hovering = $state(false);
	let focused = $state(false);
	let isWindowFocused = $state(true);
	let metadata = $state<Map<string, ToastMetadata>>(new Map());
	const timers = new SvelteMap<string, TimerInfo>();
	let areTimersPaused = false;

	function setToasts(next: ToastData[], clearInteraction = next.length === 0): void {
		toasts = next;
		metadata = createMetadata(next);
		if (clearInteraction) {
			hovering = false;
			focused = false;
		}
	}

	function shouldPauseTimers(): boolean {
		return hovering || focused || !isWindowFocused;
	}

	function clearTimer(id: string): void {
		const timer = timers.get(id);
		if (timer?.handle !== undefined) {
			window.clearTimeout(timer.handle);
		}
		timers.delete(id);
		if (timers.size === 0) {
			areTimersPaused = false;
		}
	}

	function clearTimers(): void {
		for (const timer of timers.values()) {
			if (timer.handle !== undefined) {
				window.clearTimeout(timer.handle);
			}
		}
		timers.clear();
		areTimersPaused = false;
	}

	function scheduleTimer(id: string, delay: number): void {
		if (typeof window === 'undefined' || delay <= 0) return;

		clearTimer(id);
		const start = Date.now();
		const shouldStart = !shouldPauseTimers();
		let handle: number | undefined;

		if (shouldStart) {
			handle = window.setTimeout(() => {
				timers.delete(id);
				if (timers.size === 0) {
					areTimersPaused = false;
				}
				close(id);
			}, delay);
		} else {
			areTimersPaused = true;
		}

		timers.set(id, {
			handle,
			start,
			delay,
			remaining: delay,
		});
	}

	function pauseTimers(): void {
		if (areTimersPaused || typeof window === 'undefined') return;
		areTimersPaused = true;
		for (const timer of timers.values()) {
			if (timer.handle !== undefined) {
				window.clearTimeout(timer.handle);
				timer.remaining = Math.max(timer.remaining - (Date.now() - timer.start), 0);
				timer.handle = undefined;
			}
		}
	}

	function resumeTimers(): void {
		if (!areTimersPaused || typeof window === 'undefined') return;
		if (shouldPauseTimers()) return;
		areTimersPaused = false;
		for (const [id, timer] of timers) {
			timer.remaining = timer.remaining > 0 ? timer.remaining : timer.delay;
			timer.handle = window.setTimeout(() => {
				timers.delete(id);
				if (timers.size === 0) {
					areTimersPaused = false;
				}
				close(id);
			}, timer.remaining);
			timer.start = Date.now();
		}
	}

	function remove(id: string): void {
		const toast = toasts.find((item) => item.id === id);
		if (!toast) return;
		toast.onRemove?.();
		clearTimer(id);
		setToasts(
			toasts.filter((item) => item.id !== id),
			toasts.length <= 1,
		);
	}

	function close(id?: string): void {
		if (id === undefined) {
			const active = toasts.filter((toast) => toast.transitionStatus !== 'ending');
			clearTimers();
			const ending = applyLimited(
				toasts.map((toast) =>
					toast.transitionStatus === 'ending'
						? toast
						: { ...toast, transitionStatus: 'ending' as const, height: 0 },
				),
				limit,
			);
			setToasts(ending, !ending.some((toast) => toast.transitionStatus !== 'ending'));
			for (const toast of active) {
				toast.onClose?.();
			}
			return;
		}

		const toast = toasts.find((item) => item.id === id);
		if (!toast || toast.transitionStatus === 'ending') return;

		clearTimer(id);
		const ending = applyLimited(
			toasts.map((item) =>
				item.id === id ? { ...item, transitionStatus: 'ending' as const, height: 0 } : item,
			),
			limit,
		);
		setToasts(ending, !ending.some((item) => item.transitionStatus !== 'ending'));
		toast.onClose?.();
	}

	function update(id: string, updates: ToastUpdateInput): void {
		const prev = toasts.find((toast) => toast.id === id);
		if (!prev || prev.transitionStatus === 'ending') return;

		const next: ToastData = {
			...prev,
			...updates,
			updateKey: (prev.updateKey ?? 0) + 1,
		};
		setToasts(toasts.map((toast) => (toast.id === id ? next : toast)));

		const nextTimeout = next.timeout ?? timeout;
		const shouldHaveTimer =
			next.transitionStatus !== 'ending' && next.type !== 'loading' && nextTimeout > 0;
		if (!shouldHaveTimer) {
			clearTimer(id);
			return;
		}
		if (
			Object.hasOwn(updates, 'timeout') ||
			prev.type === 'loading' ||
			(prev.timeout ?? timeout) !== nextTimeout ||
			!timers.has(id)
		) {
			scheduleTimer(id, nextTimeout);
			if (shouldPauseTimers()) {
				pauseTimers();
			}
		}
	}

	function updateHeight(id: string, height: number): void {
		const prev = toasts.find((toast) => toast.id === id);
		if (!prev || prev.transitionStatus === 'ending') return;

		const next: ToastData = {
			...prev,
			height,
			transitionStatus: prev.transitionStatus === 'starting' ? undefined : prev.transitionStatus,
		};
		if (prev.height === height && prev.transitionStatus === next.transitionStatus) return;
		setToasts(toasts.map((toast) => (toast.id === id ? next : toast)));
	}

	function add(data: ToastAddInput): string {
		const id = data.id ?? nextToastId();

		if (data.id) {
			const existing = toasts.find((toast) => toast.id === data.id);
			if (existing) {
				if (existing.transitionStatus === 'ending') {
					remove(data.id);
				} else {
					update(data.id, data);
					const duration = data.timeout ?? timeout;
					if (existing.type !== 'loading' && duration > 0) {
						scheduleTimer(data.id, duration);
						if (shouldPauseTimers()) {
							pauseTimers();
						}
					}
					return data.id;
				}
			}
		}

		const toast: ToastData = {
			id,
			title: data.title,
			description: data.description,
			timeout: data.timeout,
			type: data.type,
			priority: data.priority,
			actionProps: data.actionProps,
			anchor: data.anchor,
			onClose: data.onClose,
			onRemove: data.onRemove,
			updateKey: 0,
			transitionStatus: 'starting',
		};

		setToasts(applyLimited([toast, ...toasts], limit));

		const duration = toast.timeout ?? timeout;
		if (toast.type !== 'loading' && duration > 0) {
			scheduleTimer(id, duration);
			if (shouldPauseTimers()) {
				pauseTimers();
			}
		}

		return id;
	}

	function syncOptions(next: ToastManagerOptions): void {
		const nextTimeout = next.timeout ?? timeout;
		const nextLimit = next.limit ?? limit;
		const limitChanged = nextLimit !== limit;
		timeout = nextTimeout;
		limit = nextLimit;
		if (limitChanged) {
			setToasts(applyLimited(toasts, nextLimit));
		}
	}

	async function promise<Value>(
		pending: Promise<Value>,
		options: ToastPromiseOptions<Value>,
	): Promise<Value> {
		const loadingOpts =
			typeof options.loading === 'string' ? { title: options.loading } : options.loading;
		const id = add({ ...loadingOpts, type: 'loading', timeout: 0 });
		try {
			const result = await pending;
			const successOpts =
				typeof options.success === 'function' ? options.success(result) : options.success;
			const data = typeof successOpts === 'string' ? { title: successOpts } : successOpts;
			update(id, { ...data, type: data.type ?? 'success' });
			return result;
		} catch (error) {
			const errorOpts = typeof options.error === 'function' ? options.error(error) : options.error;
			const data = typeof errorOpts === 'string' ? { title: errorOpts } : errorOpts;
			update(id, { ...data, type: data.type ?? 'error' });
			throw error;
		}
	}

	function getMeta(id: string): ToastMetadata | undefined {
		return metadata.get(id);
	}

	return {
		get toasts() {
			return toasts;
		},
		get expanded() {
			return hovering || focused;
		},
		get timeout() {
			return timeout;
		},
		get limit() {
			return limit;
		},
		add,
		close,
		remove,
		update,
		updateHeight,
		promise,
		setHovering: (value: boolean) => {
			hovering = value;
			if (value) {
				pauseTimers();
			} else if (!focused && isWindowFocused) {
				resumeTimers();
			}
		},
		setFocused: (value: boolean) => {
			focused = value;
			if (value) {
				pauseTimers();
			} else if (!hovering && isWindowFocused) {
				resumeTimers();
			}
		},
		pauseTimers,
		resumeTimers,
		setWindowFocused: (value: boolean) => {
			isWindowFocused = value;
			if (value) {
				resumeTimers();
			} else {
				pauseTimers();
			}
		},
		syncOptions,
		getDomIndex: (id: string) => getMeta(id)?.domIndex ?? -1,
		getVisibleIndex: (id: string) => getMeta(id)?.visibleIndex ?? -1,
		getOffsetY: (id: string) => getMeta(id)?.offsetY ?? 0,
		getFrontmostHeight: () =>
			toasts.find((toast) => toast.transitionStatus !== 'ending' && toast.height != null)?.height,
	};
}
