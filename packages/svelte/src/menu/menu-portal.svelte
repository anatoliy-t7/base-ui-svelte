<script lang="ts">
	import { getContext } from 'svelte';
	import { MENU_CONTEXT } from '../internal/context-keys.js';
	import { portal } from '../internal/portal.js';
	import type { MenuContext, MenuPortalProps } from './types.js';

	let { container, keepMounted = false, children }: MenuPortalProps = $props();

	const ctx = getContext<MenuContext>(MENU_CONTEXT);

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
