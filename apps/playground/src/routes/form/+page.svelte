<script lang="ts">
	import { Field } from 'base-ui-svelte/field';
	import { Form } from 'base-ui-svelte/form';
	import '../demo.css';

	let submitted = $state('');
</script>

<h1>Form</h1>
<div class="demo">
	<Form.Root
		class="form"
		onFormSubmit={(data: FormData) => {
			submitted = String(data.get('email') ?? '');
		}}
	>
		<Field.Root class="field" name="email" validate={(v: string) => (v ? null : 'Required')}>
			<Field.Label>Email</Field.Label>
			<Field.Control class="field-input" type="email" />
			<Field.Error class="field-error" />
		</Field.Root>
		<button class="btn" type="submit">Submit</button>
	</Form.Root>
	{#if submitted}
		<p class="muted">Submitted: {submitted}</p>
	{/if}
</div>
