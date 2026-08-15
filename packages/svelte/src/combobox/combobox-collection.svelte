<script lang="ts">
	import { getContext } from 'svelte';
	import { COMBOBOX_CONTEXT } from '../internal/context-keys.js';
	import type { ComboboxCollectionProps, ComboboxContext } from './types.js';

	let { children }: ComboboxCollectionProps = $props();

	const ctx = getContext<ComboboxContext>(COMBOBOX_CONTEXT);
</script>

{#if ctx.collectionItems.length > 0}
	{#each ctx.collectionItems as item (item.value)}
		{@render children?.(item)}
	{/each}
{/if}
