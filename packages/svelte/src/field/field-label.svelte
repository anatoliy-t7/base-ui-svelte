<script lang="ts">
	import { getContext } from 'svelte';
	import { FIELD_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { FieldContext, FieldLabelProps } from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: FieldLabelProps = $props();

	const ctx = getContext<FieldContext>(FIELD_CONTEXT);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id: ctx.labelId,
			for: ctx.controlId,
			class: className,
			style,
			'data-disabled': ctx.disabled ? '' : undefined,
			'data-valid': ctx.valid === true ? '' : undefined,
			'data-invalid': ctx.valid === false ? '' : undefined,
			'data-dirty': ctx.dirty ? '' : undefined,
			'data-touched': ctx.touched ? '' : undefined,
			'data-filled': ctx.filled ? '' : undefined,
			'data-focused': ctx.focused ? '' : undefined
		})
	);
</script>

<label {...mergedProps} style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}>
	{#if children}
		{@render children()}
	{/if}
</label>
