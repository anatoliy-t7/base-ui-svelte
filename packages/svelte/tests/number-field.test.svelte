<script lang="ts">
	import { NumberField } from '../src/number-field/index.js';
</script>

<NumberField.Root defaultValue={5} min={0} max={10} step={1} name="qty" data-testid="root">
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
