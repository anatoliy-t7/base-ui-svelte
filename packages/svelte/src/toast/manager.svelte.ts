import { SvelteMap } from 'svelte/reactivity';
import type { HTMLButtonAttributes } from 'svelte/elements';

export type ToastActionPropsData = Omit<HTMLButtonAttributes, 'children'> & {
	children?: string | undefined;
};

export type ToastData = {
	readonly id: string;
	readonly title?: string | undefined;
	readonly description?: string | undefined;
	readonly timeout?: number | undefined;
	readonly actionProps?: ToastActionPropsData | undefined;
	readonly anchor?: HTMLElement | null | undefined;
};

export type ToastAddInput = {
	title?: string | undefined;
	description?: string | undefined;
	timeout?: number | undefined;
	actionProps?: ToastActionPropsData | undefined;
	anchor?: HTMLElement | null | undefined;
};

export type ToastManager = {
	readonly toasts: ToastData[];
	add: (data: ToastAddInput) => string;
	close: (id: string) => void;
};

let toastIdCounter = 0;

function nextToastId(): string {
	toastIdCounter += 1;
	return `toast-${toastIdCounter}`;
}

export function createToastManager(): ToastManager {
	let toasts = $state<ToastData[]>([]);
	const timers = new SvelteMap<string, number>();

	function close(id: string): void {
		const timer = timers.get(id);
		if (timer !== undefined) {
			window.clearTimeout(timer);
			timers.delete(id);
		}
		toasts = toasts.filter((toast) => toast.id !== id);
	}

	function add(data: ToastAddInput): string {
		const id = nextToastId();
		const toast: ToastData = {
			id,
			title: data.title,
			description: data.description,
			timeout: data.timeout,
			actionProps: data.actionProps,
			anchor: data.anchor
		};
		toasts = [...toasts, toast];

		if (data.timeout != null && data.timeout > 0 && typeof window !== 'undefined') {
			const timer = window.setTimeout(() => {
				close(id);
			}, data.timeout);
			timers.set(id, timer);
		}

		return id;
	}

	return {
		get toasts() {
			return toasts;
		},
		add,
		close
	};
}
