<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title = 'Note',
		children
	}: {
		title?: string;
		children: Snippet;
	} = $props();
</script>

<aside class="callout">
	<p class="callout-title">{title}</p>
	<div class="callout-body">
		{@render children()}
	</div>
</aside>
