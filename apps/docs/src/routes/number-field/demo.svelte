<script lang="ts">
	import { NumberField } from 'base-ui-svelte/number-field';
</script>

<NumberField.Root class="number-field" defaultValue={5} min={0} max={10} step={1} name="qty">
	<NumberField.Group class="number-field-group">
		<NumberField.Decrement class="number-field-decrement">−</NumberField.Decrement>
		<NumberField.Input class="number-field-input" aria-label="Quantity" />
		<NumberField.Increment class="number-field-increment">+</NumberField.Increment>
	</NumberField.Group>
</NumberField.Root>
