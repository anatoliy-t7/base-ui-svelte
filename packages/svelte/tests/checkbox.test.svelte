<script lang="ts">
	import { Checkbox } from '../src/index.js';
</script>

<Checkbox.Root data-testid="checkbox">
	{#snippet children()}
		<Checkbox.Indicator data-testid="indicator" />
		<span>Accept</span>
	{/snippet}
</Checkbox.Root>
