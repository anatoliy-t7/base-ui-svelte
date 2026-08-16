<script lang="ts">
	import { Field } from '../src/field/index.js';

	let {
		mode = 'custom'
	}: {
		mode?: 'custom' | 'required' | 'email' | 'match';
	} = $props();
</script>

{#if mode === 'custom'}
	<Field.Root data-testid="field" name="email" validationMode="onBlur" validate={(value) => (value ? null : 'Required')}>
		<Field.Item data-testid="item">
			<Field.Label data-testid="label">Email</Field.Label>
			<Field.Control data-testid="control" type="email" />
			<Field.Description data-testid="description">We will not share your email.</Field.Description>
			<Field.Error data-testid="error" />
			<Field.Validity>
				{#snippet children(state)}
					<div
						data-testid="validity"
						data-valid={state.validity.valid === true ? '' : undefined}
						data-invalid={state.validity.valid === false ? '' : undefined}
						data-custom-error={state.validity.customError ? '' : undefined}
					>
						{state.error}
					</div>
				{/snippet}
			</Field.Validity>
		</Field.Item>
	</Field.Root>
{:else if mode === 'required'}
	<Field.Root data-testid="field" name="username" validationMode="onBlur">
		<Field.Label data-testid="label">Username</Field.Label>
		<Field.Control data-testid="control" required />
		<Field.Error data-testid="error" />
		<Field.Validity>
			{#snippet children(state)}
				<div
					data-testid="validity"
					data-value-missing={state.validity.valueMissing ? '' : undefined}
					data-invalid={state.validity.valid === false ? '' : undefined}
				>
					{state.error}
				</div>
			{/snippet}
		</Field.Validity>
	</Field.Root>
{:else if mode === 'email'}
	<Field.Root data-testid="field" name="email" validationMode="onBlur">
		<Field.Label data-testid="label">Email</Field.Label>
		<Field.Control data-testid="control" type="email" />
		<Field.Error data-testid="error" />
		<Field.Validity>
			{#snippet children(state)}
				<div
					data-testid="validity"
					data-type-mismatch={state.validity.typeMismatch ? '' : undefined}
					data-invalid={state.validity.valid === false ? '' : undefined}
				>
					{state.error}
				</div>
			{/snippet}
		</Field.Validity>
	</Field.Root>
{:else}
	<Field.Root data-testid="field" name="username" validationMode="onBlur">
		<Field.Label data-testid="label">Username</Field.Label>
		<Field.Control data-testid="control" required />
		<Field.Error data-testid="error-value-missing" match="valueMissing">Value is required</Field.Error>
		<Field.Error data-testid="error-custom" match="customError">Custom failed</Field.Error>
	</Field.Root>
{/if}
