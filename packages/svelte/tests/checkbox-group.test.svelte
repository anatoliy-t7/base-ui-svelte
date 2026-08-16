<script lang="ts">
	import { Checkbox, CheckboxGroup } from '../src/index.js';
</script>

<CheckboxGroup data-testid="checkbox-group">
	<Checkbox.Root data-testid="checkbox-a" value="a" aria-label="A">
		{#snippet children()}
			<Checkbox.Indicator />
			A
		{/snippet}
	</Checkbox.Root>
	<Checkbox.Root data-testid="checkbox-b" value="b" aria-label="B">
		{#snippet children()}
			<Checkbox.Indicator />
			B
		{/snippet}
	</Checkbox.Root>
</CheckboxGroup>
