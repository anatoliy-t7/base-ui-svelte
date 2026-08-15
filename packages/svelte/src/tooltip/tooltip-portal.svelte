<script lang="ts">
	import { getContext } from 'svelte';
	import { TOOLTIP_CONTEXT } from '../internal/context-keys.js';
	import { portal } from '../internal/portal.js';
	import type { TooltipContext, TooltipPortalProps } from './types.js';

	let { children }: TooltipPortalProps = $props();

	const ctx = getContext<TooltipContext>(TOOLTIP_CONTEXT);
</script>

{#if ctx.presence.isPresent}
	<div {@attach portal()}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
