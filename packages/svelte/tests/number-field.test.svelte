<script lang="ts">
	import { NumberField } from '../src/number-field/index.js';

	let {
		defaultValue = 5,
		min = 0,
		max = 10,
		step = 1,
		name = 'qty',
		locale,
		format,
		allowOutOfRange = false,
		snapOnStep = true,
	}: {
		defaultValue?: number | null;
		min?: number;
		max?: number;
		step?: number;
		name?: string;
		locale?: Intl.LocalesArgument | undefined;
		format?: Intl.NumberFormatOptions | undefined;
		allowOutOfRange?: boolean;
		snapOnStep?: boolean;
	} = $props();
</script>

<NumberField.Root
	{defaultValue}
	{min}
	{max}
	{step}
	{name}
	{locale}
	{format}
	{allowOutOfRange}
	{snapOnStep}
	data-testid="root"
>
	<NumberField.ScrubArea data-testid="scrub-area" pixelSensitivity={2}>
		<span>Amount</span>
		<NumberField.ScrubAreaCursor data-testid="scrub-cursor">+</NumberField.ScrubAreaCursor>
	</NumberField.ScrubArea>
	<NumberField.Group data-testid="group">
		<NumberField.Decrement data-testid="decrement" />
		<NumberField.Input data-testid="input" aria-label="Quantity" />
		<NumberField.Increment data-testid="increment" />
	</NumberField.Group>
</NumberField.Root>
