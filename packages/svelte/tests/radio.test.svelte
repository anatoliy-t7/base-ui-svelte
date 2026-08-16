<script lang="ts">
	import { Radio, RadioGroup } from '../src/index.js';

	let {
		disabled = false,
		defaultValue = '',
		value = undefined as string | undefined,
		onValueChange,
	}: {
		disabled?: boolean;
		defaultValue?: string;
		value?: string | undefined;
		onValueChange?: (value: string, event: Event) => void;
	} = $props();
</script>

<RadioGroup
	data-testid="radio-group"
	aria-label="Options"
	{disabled}
	{defaultValue}
	{value}
	{onValueChange}
>
	<Radio.Root data-testid="radio-a" value="a" aria-label="A">
		{#snippet children()}
			<Radio.Indicator data-testid="indicator-a" />
			A
		{/snippet}
	</Radio.Root>
	<Radio.Root data-testid="radio-b" value="b" aria-label="B">
		{#snippet children()}
			<Radio.Indicator data-testid="indicator-b" />
			B
		{/snippet}
	</Radio.Root>
</RadioGroup>
