<script lang="ts">
	import { Field } from 'base-ui-svelte/field';
	import { Fieldset } from 'base-ui-svelte/fieldset';
</script>

<Fieldset.Root class="fieldset">
	<Fieldset.Legend class="fieldset-legend">Shipping</Fieldset.Legend>
	<Field.Root class="field" name="city">
		<Field.Label class="field-label">City</Field.Label>
		<Field.Control class="field-control input input-md" />
	</Field.Root>
	<Field.Root class="field" name="zip">
		<Field.Label class="field-label">ZIP</Field.Label>
		<Field.Control class="field-control input input-md" />
	</Field.Root>
</Fieldset.Root>
