<script lang="ts">
	import { partAnchorId } from './api-anchors.js';

	let {
		heading
	}: {
		heading: string;
	} = $props();

	const id = $derived(partAnchorId(heading));
</script>

<h3 {id} class="api-part-heading">
	<a href="#{id}" class="api-part-heading-link">{heading}</a>
</h3>
