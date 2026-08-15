<script lang="ts">
	import { getContext } from 'svelte';
	import { CONTEXT_MENU_CONTEXT } from '../internal/context-keys.js';
	import { portal } from '../internal/portal.js';
	import type { ContextMenuContext, ContextMenuPortalProps } from './types.js';

	let { children }: ContextMenuPortalProps = $props();

	const ctx = getContext<ContextMenuContext>(CONTEXT_MENU_CONTEXT);
</script>

{#if ctx.presence.isPresent}
	<div {@attach portal()}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
