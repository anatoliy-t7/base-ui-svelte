<script lang="ts">
	import { getContext } from 'svelte';
	import { SELECT_CONTEXT } from '../internal/context-keys.js';
	import { portal } from '../internal/portal.js';
	import type { SelectContext, SelectPortalProps } from './types.js';

	let { container, keepMounted = false, children }: SelectPortalProps = $props();

	const ctx = getContext<SelectContext>(SELECT_CONTEXT);

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
