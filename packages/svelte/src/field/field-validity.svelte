<script lang="ts">
	import { getContext } from 'svelte';
	import { FIELD_CONTEXT } from '../internal/context-keys.js';
	import type { FieldContext, FieldValidityProps, FieldValidityState } from './types.js';

	let { children }: FieldValidityProps = $props();

	const ctx = getContext<FieldContext>(FIELD_CONTEXT);

	const validityState: FieldValidityState = $derived({
		validity: ctx.validity,
		transitionStatus: ctx.valid === false ? 'idle' : undefined,
		errors: ctx.errors,
		value: ctx.value,
		error: ctx.errors[0] ?? '',
		initialValue: ctx.initialValue
	});
</script>

{@render children(validityState)}
