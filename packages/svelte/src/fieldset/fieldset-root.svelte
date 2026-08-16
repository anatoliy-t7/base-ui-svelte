<script lang="ts">
	import { setContext } from 'svelte';
	import { useId } from '../internal/controllable.svelte.js';
	import { FIELDSET_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { FieldsetContext, FieldsetRootProps } from './types.js';

	let {
		disabled = false,
		class: className,
		style,
		id = useId('fieldset'),
		children,
		...rest
	}: FieldsetRootProps = $props();

	setContext(FIELDSET_CONTEXT, {
		get disabled() {
			return disabled;
		},
	} satisfies FieldsetContext);

	const rootProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			class: className,
			style,
			disabled: disabled || undefined,
			'data-disabled': disabled ? '' : undefined,
		}),
	);
</script>

<fieldset {...rootProps} style={typeof rootProps.style === 'string' ? rootProps.style : undefined}>
	{#if children}
		{@render children({ disabled })}
	{/if}
</fieldset>
