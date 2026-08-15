<script lang="ts">
	import { getContext } from 'svelte';
	import { NAVIGATION_MENU_CONTEXT } from '../internal/context-keys.js';
	import { portal } from '../internal/portal.js';
	import type { NavigationMenuContext, NavigationMenuPortalProps } from './types.js';

	let { children }: NavigationMenuPortalProps = $props();

	const ctx = getContext<NavigationMenuContext>(NAVIGATION_MENU_CONTEXT);
</script>

{#if ctx.presence.isPresent}
	<div {@attach portal()}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
