<script lang="ts">
	import { setContext } from 'svelte';
	import { TOAST_CONTEXT } from '../internal/context-keys.js';
	import { createToastManager } from './manager.svelte.js';
	import type { ToastContext, ToastProviderProps } from './types.js';

	let { toaster, children }: ToastProviderProps = $props();

	const fallback = createToastManager();

	function resolveManager() {
		return toaster ?? fallback;
	}

	setContext(TOAST_CONTEXT, {
		get toasts() {
			return resolveManager().toasts;
		},
		add: (data) => resolveManager().add(data),
		close: (id) => resolveManager().close(id),
		get toast() {
			return null;
		}
	} satisfies ToastContext);
</script>

{#if children}
	{@render children()}
{/if}
