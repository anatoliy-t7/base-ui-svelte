<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';

	let {
		title,
		lead,
		children
	}: {
		title: string;
		lead?: string;
		children?: Snippet;
	} = $props();

	const markdownHref = $derived(
		page.url.pathname === '/' ? '/index.md' : `${page.url.pathname.replace(/\/$/, '')}.md`
	);
</script>

<header class="doc-header">
	<h1>{title}</h1>
	{#if lead}
		<div class="doc-lead-row">
			<p class="doc-lead">{lead}</p>
			<a class="doc-md-link" href={markdownHref} rel="external">View as Markdown</a>
		</div>
	{:else}
		<a class="doc-md-link doc-md-link-solo" href={markdownHref} rel="external">View as Markdown</a>
	{/if}
	{#if children}
		{@render children()}
	{/if}
</header>
