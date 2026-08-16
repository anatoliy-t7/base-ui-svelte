<script lang="ts">
	import { Field } from 'base-ui-svelte/field';
</script>

<h1>Field</h1>

<section class="demo">
	<Field.Root
		class="field"
		name="email"
		validationMode="onBlur"
		validate={(v: string) => (v ? null : 'Required')}
	>
		<Field.Label class="field-label">Email</Field.Label>
		<Field.Control
			class="field-control input input-md"
			type="email"
			placeholder="you@example.com"
		/>
		<Field.Description class="field-description">We will not share your email.</Field.Description>
		<Field.Error class="field-error" />
	</Field.Root>
</section>
