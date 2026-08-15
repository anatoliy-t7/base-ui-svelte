<script lang="ts">
	import { getContext } from 'svelte';
	import { FIELD_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { FieldContext, FieldErrorProps } from './types.js';

	let {
		match,
		class: className,
		style,
		children,
		...rest
	}: FieldErrorProps = $props();

	const ctx = getContext<FieldContext>(FIELD_CONTEXT);

	const errorMessage = $derived(ctx.errors[0]);

	const shouldShow = $derived.by(() => {
		if (match === true) return true;
		if (match === false) return false;
		if (typeof match === 'string') {
			if (match === 'customError') return ctx.errors.length > 0;
			return ctx.valid === false;
		}
		return ctx.valid === false && (ctx.touched || ctx.errors.length > 0);
	});

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id: ctx.errorId,
			role: 'alert',
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

{#if shouldShow}
	<div {...mergedProps} style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}>
		{#if children}
			{@render children({ error: errorMessage })}
		{:else if errorMessage}
			{errorMessage}
		{/if}
	</div>
{/if}
