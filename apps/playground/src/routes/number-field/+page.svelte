<script lang="ts">
	import { NumberField } from 'base-ui-svelte/number-field';
	import '../demo.css';
</script>

<h1>Number Field</h1>
<div class="demo">
	<NumberField.Root defaultValue={5} min={0} max={10} step={1} name="qty">
		<NumberField.Group class="number-group">
			<NumberField.Decrement class="btn">−</NumberField.Decrement>
			<NumberField.Input class="field-input" aria-label="Quantity" />
			<NumberField.Increment class="btn">+</NumberField.Increment>
		</NumberField.Group>
	</NumberField.Root>
</div>
