<script lang="ts">
	import { getContext } from 'svelte';
	import { AUTOCOMPLETE_CONTEXT } from '../internal/context-keys.js';
	import type { AutocompleteContext, AutocompleteValueProps } from './types.js';

	let { children }: AutocompleteValueProps = $props();

	const ctx = getContext<AutocompleteContext>(AUTOCOMPLETE_CONTEXT);
</script>

{#if children}
	{@render children(ctx.value)}
{:else}
	{ctx.getSelectedLabel() ?? ctx.value ?? ''}
{/if}
