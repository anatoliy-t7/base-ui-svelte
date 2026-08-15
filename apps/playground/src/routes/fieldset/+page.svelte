<script lang="ts">
	import { Field } from 'base-ui-svelte/field';
	import { Fieldset } from 'base-ui-svelte/fieldset';
	import '../demo.css';
</script>

<h1>Fieldset</h1>
<div class="demo">
	<Fieldset.Root class="fieldset">
		<Fieldset.Legend>Shipping</Fieldset.Legend>
		<Field.Root class="field" name="city">
			<Field.Label>City</Field.Label>
			<Field.Control class="field-input" />
		</Field.Root>
		<Field.Root class="field" name="zip">
			<Field.Label>ZIP</Field.Label>
			<Field.Control class="field-input" />
		</Field.Root>
	</Fieldset.Root>
</div>
