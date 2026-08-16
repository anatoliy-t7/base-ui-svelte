<script lang="ts">
	import { getComponentApi } from './registry.js';
	import ApiTable from './ApiTable.svelte';

	let {
		slug
	}: {
		slug: string;
	} = $props();

	const api = $derived(getComponentApi(slug));
</script>

{#if api}
	<section class="api-reference">
		<p class="api-lede">
			Props mirror
			<a
				href="https://base-ui.com/react/components/{slug}"
				target="_blank"
				rel="noopener noreferrer">Base UI React</a
			>
			where applicable, adapted for Svelte 5. Native HTML attributes for the rendered element are also
			accepted unless noted.
		</p>

		{#each api.parts as part (part.heading)}
			<h3>{part.heading}</h3>
			{#if part.extendsNote}
				<p class="api-extends">{part.extendsNote}</p>
			{/if}
			{#if part.props.length === 0 && part.dataAttributes.length === 0}
				<p class="api-empty">No component-specific props — HTML attributes and children only.</p>
			{:else}
				<ApiTable props={part.props} dataAttributes={part.dataAttributes} />
			{/if}
		{/each}
	</section>
{/if}

<style>
	.api-reference {
		margin-top: 0.5rem;
	}

	.api-lede,
	.api-extends,
	.api-empty {
		margin: 0.4rem 0 0.85rem;
		max-width: 42rem;
		line-height: 1.55;
		color: color-mix(in srgb, var(--docs-fg, #151a21) 88%, #4a5560);
		font-size: 0.95rem;
	}

	.api-extends {
		font-size: 0.875rem;
		color: var(--docs-fg-muted, #4a5560);
	}
</style>
