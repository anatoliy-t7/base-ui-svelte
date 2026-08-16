<script lang="ts">
	import { getContext } from 'svelte';
	import { AUTOCOMPLETE_CONTEXT } from '../internal/context-keys.js';
	import type { AutocompleteCollectionProps, AutocompleteContext } from './types.js';

	let { children }: AutocompleteCollectionProps = $props();

	const ctx = getContext<AutocompleteContext>(AUTOCOMPLETE_CONTEXT);
</script>

{#if ctx.collectionItems.length > 0}
	{#each ctx.collectionItems as item (item.value)}
		{@render children?.(item)}
	{/each}
{/if}
