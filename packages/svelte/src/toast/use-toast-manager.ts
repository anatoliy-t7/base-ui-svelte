import { getContext } from 'svelte';
import { TOAST_CONTEXT } from '../internal/context-keys.js';
import type { ToastManager } from './manager.svelte.js';
import type { ToastContext } from './types.js';

/**
 * Returns the toast manager from the nearest {@link Toast.Provider}.
 */
export function useToastManager(): ToastManager {
	const ctx = getContext<ToastContext | undefined>(TOAST_CONTEXT);
	if (!ctx) {
		throw new Error('Toast.useToastManager must be used within Toast.Provider');
	}
	return {
		get toasts() {
			return ctx.toasts;
		},
		get expanded() {
			return ctx.expanded;
		},
		get timeout() {
			return ctx.timeout;
		},
		get limit() {
			return ctx.limit;
		},
		add: (data) => ctx.add(data),
		close: (id) => ctx.close(id),
		remove: (id) => ctx.remove(id),
		update: (id, updates) => ctx.update(id, updates),
		updateHeight: (id, height) => ctx.updateHeight(id, height),
		promise: (pending, options) => ctx.promise(pending, options),
		setHovering: (value) => ctx.setHovering(value),
		setFocused: (value) => ctx.setFocused(value),
		pauseTimers: () => ctx.pauseTimers(),
		resumeTimers: () => ctx.resumeTimers(),
		setWindowFocused: (value) => ctx.setWindowFocused(value),
		syncOptions: (options) => ctx.syncOptions(options),
		getDomIndex: (id) => ctx.getDomIndex(id),
		getVisibleIndex: (id) => ctx.getVisibleIndex(id),
		getOffsetY: (id) => ctx.getOffsetY(id),
		getFrontmostHeight: () => ctx.getFrontmostHeight(),
	};
}
