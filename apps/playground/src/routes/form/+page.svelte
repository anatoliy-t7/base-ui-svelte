<script lang="ts">
	import { Field } from 'base-ui-svelte/field';
	import { Form } from 'base-ui-svelte/form';

	let submitted = $state('');
</script>

<h1>Form</h1>

<section class="demo">
	<Form
		class="form"
		onFormSubmit={(data: FormData) => {
			submitted = String(data.get('email') ?? '');
		}}
	>
		<Field.Root class="field" name="email" validate={(v: string) => (v ? null : 'Required')}>
			<Field.Label class="field-label">Email</Field.Label>
			<Field.Control class="field-control input input-md" type="email" />
			<Field.Error class="field-error" />
		</Field.Root>
		<button class="btn" type="submit">Submit</button>
	</Form>
	{#if submitted}
		<p class="muted">Submitted: {submitted}</p>
	{/if}
</section>
