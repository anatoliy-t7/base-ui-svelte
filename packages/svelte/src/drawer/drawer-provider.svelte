<script lang="ts">
	import { setContext } from 'svelte';
	import { DRAWER_PROVIDER_CONTEXT } from '../internal/context-keys.js';
	import type { DrawerProviderContext, DrawerProviderProps } from './types.js';

	let { swipeDirection = 'down', children }: DrawerProviderProps = $props();

	const store = $state({ openCount: 0 });

	function registerOpen(): () => void {
		store.openCount += 1;
		return () => {
			store.openCount = Math.max(0, store.openCount - 1);
		};
	}

	setContext(DRAWER_PROVIDER_CONTEXT, {
		get openCount() {
			return store.openCount;
		},
		get swipeDirection() {
			return swipeDirection;
		},
		registerOpen,
	} satisfies DrawerProviderContext);
</script>

{#if children}
	{@render children()}
{/if}
