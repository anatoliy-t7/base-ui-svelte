<script lang="ts">
	import { getContext } from 'svelte';
	import { TOOLTIP_CONTEXT } from '../internal/context-keys.js';
	import { portal } from '../internal/portal.js';
	import type { TooltipContext, TooltipPortalProps } from './types.js';

	let { container, keepMounted = false, children }: TooltipPortalProps = $props();

	const ctx = getContext<TooltipContext>(TOOLTIP_CONTEXT);

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
