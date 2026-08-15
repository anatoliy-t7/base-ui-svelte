<script lang="ts">
	import { getContext } from 'svelte';
	import { AUTOCOMPLETE_CONTEXT } from '../internal/context-keys.js';
	import { portal } from '../internal/portal.js';
	import type { AutocompleteContext, AutocompletePortalProps } from './types.js';

	let { children }: AutocompletePortalProps = $props();

	const ctx = getContext<AutocompleteContext>(AUTOCOMPLETE_CONTEXT);
</script>

{#if ctx.presence.isPresent}
	<div {@attach portal()}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
