<script lang="ts">
	import { getContext } from 'svelte';
	import { POPOVER_CONTEXT } from '../internal/context-keys.js';
	import { portal } from '../internal/portal.js';
	import type { PopoverContext, PopoverPortalProps } from './types.js';

	let { container, keepMounted = false, children }: PopoverPortalProps = $props();

	const ctx = getContext<PopoverContext>(POPOVER_CONTEXT);

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
