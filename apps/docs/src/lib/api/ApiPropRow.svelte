<script lang="ts">
	import type { ApiProp } from './registry.js';
	import { displayDefault, formatTypeBlock, hasDefault, shortType } from './api-format.js';
	import { propAnchorId } from './api-anchors.js';
	import ApiDescription from './ApiDescription.svelte';

	let {
		prop,
		partHeading
	}: {
		prop: ApiProp;
		partHeading: string;
	} = $props();

	let detailsEl = $state<HTMLDetailsElement | null>(null);

	const typeLabel = $derived(shortType(prop.type));
	const typeBlock = $derived(formatTypeBlock(prop.type));
	const defaultDisplay = $derived(displayDefault(prop.defaultValue));
	const showDefault = $derived(hasDefault(prop.defaultValue));
	const anchorId = $derived(propAnchorId(partHeading, prop.name));

	function syncOpenFromHash(): void {
		if (typeof window === 'undefined' || !detailsEl) return;
		const hash = window.location.hash.slice(1);
		if (hash === anchorId) {
			detailsEl.open = true;
			detailsEl.scrollIntoView({ block: 'start' });
		}
	}

	$effect(() => {
		syncOpenFromHash();
		const onHashChange = (): void => syncOpenFromHash();
		window.addEventListener('hashchange', onHashChange);
		return () => window.removeEventListener('hashchange', onHashChange);
	});
</script>

<details class="api-prop-row" bind:this={detailsEl}>
	<summary class="api-prop-summary">
		<span class="api-prop-col api-prop-col-name">
			<a
				href="#{anchorId}"
				id={anchorId}
				class="api-prop-name-link"
				onclick={(event) => event.stopPropagation()}
			>
				<code>{prop.name}</code>
			</a>
		</span>
		<span class="api-prop-col api-prop-col-type"><code>{typeLabel}</code></span>
		<span class="api-prop-col api-prop-col-default"><code>{defaultDisplay}</code></span>
		<span class="api-prop-chevron" aria-hidden="true"></span>
	</summary>
	<div class="api-prop-panel">
		<dl class="api-prop-details">
			<div class="api-prop-detail api-prop-detail-name">
				<dt>Name</dt>
				<dd>
					<a href="#{anchorId}" class="api-prop-name-link"><code>{prop.name}</code></a>
				</dd>
			</div>
			<div class="api-prop-detail">
				<dt>Description</dt>
				<dd><ApiDescription source={prop.description} /></dd>
			</div>
			<div class="api-prop-detail">
				<dt>Type</dt>
				<dd>
					<pre class="api-type-block"><code>{typeBlock}</code></pre>
				</dd>
			</div>
			{#if showDefault}
				<div class="api-prop-detail">
					<dt>Default</dt>
					<dd><code>{defaultDisplay}</code></dd>
				</div>
			{/if}
		</dl>
	</div>
</details>
