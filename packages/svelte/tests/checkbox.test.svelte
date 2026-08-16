<script lang="ts">
	import { Checkbox } from '../src/index.js';

	let {
		indeterminate = false,
		readOnly = false,
	}: {
		indeterminate?: boolean;
		readOnly?: boolean;
	} = $props();
</script>

<Checkbox.Root data-testid="checkbox" {indeterminate} {readOnly}>
	{#snippet children()}
		<Checkbox.Indicator data-testid="indicator" />
		<span>Accept</span>
	{/snippet}
</Checkbox.Root>
