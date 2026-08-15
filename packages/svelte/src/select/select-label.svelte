<script lang="ts">
	import { getContext } from 'svelte';
	import { useId } from '../internal/controllable.svelte.js';
	import { SELECT_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { SelectContext, SelectLabelProps } from './types.js';

	let {
		class: className,
		style,
		id: idProp,
		children,
		...rest
	}: SelectLabelProps = $props();

	const ctx = getContext<SelectContext>(SELECT_CONTEXT);
	const fallbackId = useId('select-label');
	const id = $derived(idProp ?? fallbackId);

	$effect(() => {
		ctx.setLabelId(id);
		return () => {
			if (ctx.labelId === id) {
				ctx.setLabelId(undefined);
			}
		};
	});

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			for: ctx.triggerId,
			class: className,
			style,
			'data-disabled': ctx.disabled ? '' : undefined
		})
	);
</script>

<label {...mergedProps} style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}>
	{#if children}
		{@render children()}
	{/if}
</label>
