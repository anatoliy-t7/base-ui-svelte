<script lang="ts">
	import { Field } from '../src/field/index.js';
	import { Form } from '../src/form/index.js';

	let {
		errors = {},
		onFormSubmit,
		requireUsername = false
	}: {
		errors?: Record<string, string | string[]>;
		onFormSubmit?: (formData: FormData, event: SubmitEvent) => void;
		requireUsername?: boolean;
	} = $props();
</script>

<Form data-testid="form" {errors} {onFormSubmit}>
	<Field.Root name="username" data-testid="field">
		<Field.Label>Username</Field.Label>
		<Field.Control data-testid="control" required={requireUsername || undefined} />
		<Field.Error data-testid="error" match={true} />
	</Field.Root>
	<button type="submit">Submit</button>
</Form>
