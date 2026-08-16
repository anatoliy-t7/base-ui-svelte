<script lang="ts">
	import { setContext } from 'svelte';
	import { TOAST_CONTEXT } from '../internal/context-keys.js';
	import { createToastManager } from './manager.svelte.js';
	import type { ToastContext, ToastProviderProps } from './types.js';

	let { toaster, timeout = 5000, limit = 3, children }: ToastProviderProps = $props();

	const fallback = createToastManager();

	function resolveManager() {
		return toaster ?? fallback;
	}

	$effect(() => {
		resolveManager().syncOptions({ timeout, limit });
	});

	setContext(TOAST_CONTEXT, {
		get toasts() {
			return resolveManager().toasts;
		},
		get expanded() {
			return resolveManager().expanded;
		},
		get timeout() {
			return resolveManager().timeout;
		},
		get limit() {
			return resolveManager().limit;
		},
		add: (data) => resolveManager().add(data),
		close: (id) => resolveManager().close(id),
		remove: (id) => resolveManager().remove(id),
		update: (id, updates) => resolveManager().update(id, updates),
		updateHeight: (id, height) => resolveManager().updateHeight(id, height),
		promise: (pending, options) => resolveManager().promise(pending, options),
		setHovering: (value) => resolveManager().setHovering(value),
		setFocused: (value) => resolveManager().setFocused(value),
		pauseTimers: () => resolveManager().pauseTimers(),
		resumeTimers: () => resolveManager().resumeTimers(),
		setWindowFocused: (value) => resolveManager().setWindowFocused(value),
		syncOptions: (options) => resolveManager().syncOptions(options),
		getDomIndex: (id) => resolveManager().getDomIndex(id),
		getVisibleIndex: (id) => resolveManager().getVisibleIndex(id),
		getOffsetY: (id) => resolveManager().getOffsetY(id),
		getFrontmostHeight: () => resolveManager().getFrontmostHeight(),
		get toast() {
			return null;
		},
		get toastIndex() {
			return -1;
		},
		get toastVisibleIndex() {
			return -1;
		},
		get toastOffsetY() {
			return 0;
		},
		get toastOpen() {
			return false;
		},
		get presenceStarting() {
			return false;
		},
		get presenceEnding() {
			return false;
		},
	} satisfies ToastContext);
</script>

{#if children}
	{@render children()}
{/if}
