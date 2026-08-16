<script lang="ts">
	import type { Snippet } from 'svelte';
	import DocHeader from './DocHeader.svelte';
	import Seo from './Seo.svelte';

	let {
		title,
		description,
		lead,
		children
	}: {
		title?: string;
		/** Preferred (bits-ui / shadcn-svelte style). */
		description?: string;
		/** @deprecated Prefer `description`. */
		lead?: string;
		children?: Snippet;
	} = $props();

	const summary = $derived(description ?? lead);
</script>

<Seo {title} description={summary} type="article" />

{#if title}
	<DocHeader {title} lead={summary} />
{/if}

<article class="prose">
	{#if children}
		{@render children()}
	{/if}
</article>
