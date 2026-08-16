<script lang="ts">
	import { Field } from 'base-ui-svelte/field';
</script>

<Field.Root
	class="field"
	name="email"
	validationMode="onBlur"
	validate={(v: string) => (v ? null : 'Required')}
>
	<Field.Label class="field-label">Email</Field.Label>
	<Field.Control class="field-control input input-md" type="email" placeholder="you@example.com" />
	<Field.Description class="field-description">We will not share your email.</Field.Description>
	<Field.Error class="field-error" />
</Field.Root>
