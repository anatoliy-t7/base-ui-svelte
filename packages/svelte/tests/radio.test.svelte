<script lang="ts">
	import { Radio, RadioGroup } from '../src/index.js';
</script>

<RadioGroup.Root data-testid="radio-group" aria-label="Options">
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
</RadioGroup.Root>
