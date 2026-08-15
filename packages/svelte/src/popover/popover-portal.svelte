<script lang="ts">
	import { getContext } from 'svelte';
	import { POPOVER_CONTEXT } from '../internal/context-keys.js';
	import { portal } from '../internal/portal.js';
	import type { PopoverContext, PopoverPortalProps } from './types.js';

	let { children }: PopoverPortalProps = $props();

	const ctx = getContext<PopoverContext>(POPOVER_CONTEXT);
</script>

{#if ctx.presence.isPresent}
	<div {@attach portal()}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
