<script lang="ts">
	import { getContext, hasContext, setContext } from 'svelte';
	import { FIELD_CONTEXT, FIELD_ITEM_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { FieldContext, FieldItemContext, FieldItemProps } from './types.js';

	let {
		render = 'div',
		disabled: disabledProp = false,
		class: className,
		style,
		children,
		...rest
	}: FieldItemProps = $props();

	const ctx = hasContext(FIELD_CONTEXT) ? getContext<FieldContext>(FIELD_CONTEXT) : undefined;

	const disabled = $derived((ctx?.disabled ?? false) || disabledProp);

	setContext(FIELD_ITEM_CONTEXT, {
		get disabled() {
			return disabled;
		},
	} satisfies FieldItemContext);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style,
			'data-disabled': disabled ? '' : undefined,
			'data-valid': ctx?.valid === true ? '' : undefined,
			'data-invalid': ctx?.valid === false ? '' : undefined,
			'data-dirty': ctx?.dirty ? '' : undefined,
			'data-touched': ctx?.touched ? '' : undefined,
			'data-filled': ctx?.filled ? '' : undefined,
			'data-focused': ctx?.focused ? '' : undefined,
		}),
	);
</script>

<svelte:element
	this={render}
	{...mergedProps}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
>
	{#if children}
		{@render children()}
	{/if}
</svelte:element>
