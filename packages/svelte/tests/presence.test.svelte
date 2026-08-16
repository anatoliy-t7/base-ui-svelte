<script lang="ts">
	import { createPresence } from '../src/internal/presence.svelte.js';

	let {
		present = $bindable(false),
		fallbackMs = 5000,
	}: {
		present?: boolean;
		fallbackMs?: number;
	} = $props();

	const presence = createPresence(() => present, {
		get fallbackMs() {
			return fallbackMs;
		},
	});

	let nodeEl = $state<HTMLElement | null>(null);

	$effect(() => {
		presence.setNode(nodeEl);
		return () => presence.setNode(null);
	});
</script>

<button type="button" data-testid="toggle" onclick={() => (present = !present)}> Toggle </button>

{#if presence.isPresent}
	<div
		bind:this={nodeEl}
		data-testid="node"
		data-status={presence.status}
		data-starting={presence.isStarting ? '' : undefined}
		data-ending={presence.isEnding ? '' : undefined}
		data-open={present ? '' : undefined}
		data-closed={!present || presence.isEnding ? '' : undefined}
	>
		Content
	</div>
{/if}
