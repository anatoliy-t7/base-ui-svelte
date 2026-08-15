<script lang="ts">
	import { getContext } from 'svelte';
	import { FIELD_CONTEXT } from '../internal/context-keys.js';
	import type { FieldContext, FieldValidityProps, FieldValidityState } from './types.js';

	let { children }: FieldValidityProps = $props();

	const ctx = getContext<FieldContext>(FIELD_CONTEXT);

	const validity: FieldValidityState = $derived({
		valid: ctx.valid,
		errors: ctx.errors,
		error: ctx.errors[0],
		value: ctx.value,
		touched: ctx.touched,
		dirty: ctx.dirty,
		filled: ctx.filled,
		focused: ctx.focused
	});
</script>

{@render children(validity)}
