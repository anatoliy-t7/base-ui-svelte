<script lang="ts">
	import { getContext } from 'svelte';
	import { AUTOCOMPLETE_CONTEXT } from '../internal/context-keys.js';
	import { portal } from '../internal/portal.js';
	import type { AutocompleteContext, AutocompletePortalProps } from './types.js';

	let { container, keepMounted = false, children }: AutocompletePortalProps = $props();

	const ctx = getContext<AutocompleteContext>(AUTOCOMPLETE_CONTEXT);

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
