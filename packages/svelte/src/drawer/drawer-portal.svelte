<script lang="ts">
	import { getContext } from 'svelte';
	import { DRAWER_CONTEXT } from '../internal/context-keys.js';
	import { portal } from '../internal/portal.js';
	import type { DrawerContext, DrawerPortalProps } from './types.js';

	let { container, keepMounted = false, children }: DrawerPortalProps = $props();

	const ctx = getContext<DrawerContext>(DRAWER_CONTEXT);

	const shouldRender = $derived(keepMounted || ctx.presence.isPresent);
</script>

{#if shouldRender}
	<div
		{@attach portal(container)}
		hidden={keepMounted && !ctx.presence.isPresent ? true : undefined}
	>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
