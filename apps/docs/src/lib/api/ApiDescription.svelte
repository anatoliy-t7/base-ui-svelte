<script lang="ts">
	import { renderDescriptionMarkdown } from './render-description.js';

	let {
		source = ''
	}: {
		source?: string;
	} = $props();

	const html = $derived(renderDescriptionMarkdown(source));
</script>

{#if html}
	<div class="api-description">{@html html}</div>
{:else}
	<p class="api-description-empty">—</p>
{/if}
