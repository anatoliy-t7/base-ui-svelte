<script lang="ts">
	import type { ApiDataAttr, ApiProp } from './registry.js';

	let {
		props = [],
		dataAttributes = []
	}: {
		props?: ApiProp[];
		dataAttributes?: ApiDataAttr[];
	} = $props();
</script>

{#if props.length > 0}
	<div class="api-table-wrap">
		<table class="api-table">
			<thead>
				<tr>
					<th scope="col">Property</th>
					<th scope="col">Type</th>
					<th scope="col">Default</th>
					<th scope="col">Description</th>
				</tr>
			</thead>
			<tbody>
				{#each props as prop (prop.name)}
					<tr>
						<td><code>{prop.name}</code></td>
						<td><code class="api-type">{prop.type}</code></td>
						<td><code>{prop.defaultValue}</code></td>
						<td>{prop.description || '—'}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

{#if dataAttributes.length > 0}
	<div class="api-table-wrap">
		<table class="api-table">
			<thead>
				<tr>
					<th scope="col">Data attribute</th>
					<th scope="col">Description</th>
				</tr>
			</thead>
			<tbody>
				{#each dataAttributes as attr (attr.name)}
					<tr>
						<td><code>{attr.name}</code></td>
						<td>{attr.description}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

<style>
	.api-table-wrap {
		margin: 0.75rem 0 1.25rem;
		overflow-x: auto;
		border: 1px solid var(--docs-border, color-mix(in srgb, #151a21 10%, transparent));
		border-radius: calc(var(--docs-radius, 0.5rem) + 0.05rem);
		background: var(--docs-surface, #fff);
	}

	.api-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
		line-height: 1.45;
	}

	.api-table th,
	.api-table td {
		padding: 0.7rem 0.85rem;
		text-align: left;
		vertical-align: top;
		border-bottom: 1px solid var(--docs-border, color-mix(in srgb, #151a21 10%, transparent));
	}

	.api-table th {
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		text-transform: uppercase;
		color: var(--docs-fg-muted, #4a5560);
		background: color-mix(in srgb, var(--docs-bg, #f4f2ee) 70%, var(--docs-surface, #fff));
		white-space: nowrap;
	}

	.api-table tr:last-child td {
		border-bottom: 0;
	}

	.api-table :global(code) {
		font-size: 1em;
		font-family: var(--font-mono, ui-monospace, monospace);
		padding: 0.1em 0.3em;
		border-radius: 0.25rem;
		background: var(--docs-code-inline-bg, color-mix(in srgb, #151a21 6%, #fff));
	}

	.api-table .api-type {
		white-space: pre-wrap;
	}
</style>
