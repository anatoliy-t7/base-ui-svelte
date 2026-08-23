<script lang="ts">
	import { getContext } from 'svelte';
	import { CONTEXT_MENU_CONTEXT } from '../internal/context-keys.js';
	import { portal } from '../internal/portal.js';
	import type { ContextMenuContext, ContextMenuPortalProps } from './types.js';

	let { container, keepMounted = false, children }: ContextMenuPortalProps = $props();

	const ctx = getContext<ContextMenuContext>(CONTEXT_MENU_CONTEXT);

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
