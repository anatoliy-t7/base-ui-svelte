<script lang="ts">
	import { Checkbox, CheckboxGroup } from '../src/index.js';

	let {
		withParent = false,
		disabled = false,
		defaultValue = [] as string[],
	}: {
		withParent?: boolean;
		disabled?: boolean;
		defaultValue?: string[];
	} = $props();
</script>

{#if withParent}
	<CheckboxGroup data-testid="checkbox-group" allValues={['a', 'b']} {disabled} {defaultValue}>
		<Checkbox.Root data-testid="checkbox-parent" parent aria-label="All">
			{#snippet children({ checked, indeterminate })}
				<Checkbox.Indicator />
				All ({checked ? 'on' : indeterminate ? 'mixed' : 'off'})
			{/snippet}
		</Checkbox.Root>
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
{:else}
	<CheckboxGroup data-testid="checkbox-group" {disabled} {defaultValue}>
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
{/if}
