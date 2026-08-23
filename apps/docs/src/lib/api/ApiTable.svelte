<script lang="ts">
	import type { ApiDataAttr, ApiProp } from './registry.js';
	import ApiPropRow from './ApiPropRow.svelte';

	let {
		props = [],
		dataAttributes = [],
		partHeading = ''
	}: {
		props?: ApiProp[];
		dataAttributes?: ApiDataAttr[];
		partHeading?: string;
	} = $props();
</script>

{#if props.length > 0}
	<div class="api-props-table">
		<div class="api-props-header" aria-hidden="true">
			<span class="api-prop-col api-prop-col-name">Prop</span>
			<span class="api-prop-col api-prop-col-type">Type</span>
			<span class="api-prop-col api-prop-col-default">Default</span>
			<span class="api-prop-chevron-spacer" aria-hidden="true"></span>
		</div>
		<div class="api-props-body">
			{#each props as prop (prop.name)}
				<ApiPropRow {prop} {partHeading} />
			{/each}
		</div>
	</div>
{/if}

{#if dataAttributes.length > 0}
	<div class="api-table-wrap">
		<table class="api-table">
			<thead>
				<tr>
					<th scope="col">Attribute</th>
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
