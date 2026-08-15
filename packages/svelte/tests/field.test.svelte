<script lang="ts">
	import { Field } from '../src/field/index.js';
</script>

<Field.Root data-testid="field" name="email" validationMode="onBlur" validate={(value) => (value ? null : 'Required')}>
	<Field.Item data-testid="item">
		<Field.Label data-testid="label">Email</Field.Label>
		<Field.Control data-testid="control" type="email" />
		<Field.Description data-testid="description">We will not share your email.</Field.Description>
		<Field.Error data-testid="error" />
		<Field.Validity>
			{#snippet children(validity)}
				<div data-testid="validity" data-valid={validity.valid === true ? '' : undefined} data-invalid={validity.valid === false ? '' : undefined}>
					{validity.error ?? ''}
				</div>
			{/snippet}
		</Field.Validity>
	</Field.Item>
</Field.Root>
