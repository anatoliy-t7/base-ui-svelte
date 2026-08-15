<script lang="ts">
	import { getContext } from 'svelte';
	import { MENU_CONTEXT } from '../internal/context-keys.js';
	import { portal } from '../internal/portal.js';
	import type { MenuContext, MenuPortalProps } from './types.js';

	let { children }: MenuPortalProps = $props();

	const ctx = getContext<MenuContext>(MENU_CONTEXT);
</script>

{#if ctx.presence.isPresent}
	<div {@attach portal()}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
