<script lang="ts">
	import { setContext } from 'svelte';
	import { TOOLTIP_PROVIDER_CONTEXT } from '../internal/context-keys.js';
	import type { TooltipProviderContext, TooltipProviderProps } from './types.js';

	let { delay, closeDelay, timeout = 400, children }: TooltipProviderProps = $props();

	let lastCloseAt = $state(0);

	function markClosed(): void {
		lastCloseAt = Date.now();
	}

	function shouldOpenInstantly(): boolean {
		if (timeout <= 0) return false;
		return Date.now() - lastCloseAt < timeout;
	}

	setContext(TOOLTIP_PROVIDER_CONTEXT, {
		get delay() {
			return delay;
		},
		get closeDelay() {
			return closeDelay;
		},
		get timeout() {
			return timeout;
		},
		markClosed,
		shouldOpenInstantly,
	} satisfies TooltipProviderContext);
</script>

{#if children}
	{@render children()}
{/if}
