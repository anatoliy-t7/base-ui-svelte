<script lang="ts">
	import { getContext } from 'svelte';
	import { DRAWER_CONTEXT } from '../internal/context-keys.js';
	import { portal } from '../internal/portal.js';
	import type { DrawerContext, DrawerPortalProps } from './types.js';

	let { children }: DrawerPortalProps = $props();

	const ctx = getContext<DrawerContext>(DRAWER_CONTEXT);
</script>

{#if ctx.presence.isPresent}
	<div {@attach portal()}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
