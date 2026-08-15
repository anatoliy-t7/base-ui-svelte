<script lang="ts">
	import { Field } from 'base-ui-svelte/field';
	import '../demo.css';
</script>

<h1>Field</h1>
<div class="demo">
	<Field.Root class="field" name="email" validationMode="onBlur" validate={(v: string) => (v ? null : 'Required')}>
		<Field.Label>Email</Field.Label>
		<Field.Control class="field-input" type="email" placeholder="you@example.com" />
		<Field.Description>We will not share your email.</Field.Description>
		<Field.Error class="field-error" />
	</Field.Root>
</div>
