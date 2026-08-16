<script lang="ts">
	import { getContext } from 'svelte';
	import { useId } from '../internal/controllable.svelte.js';
	import { CONTEXT_MENU_GROUP_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { ContextMenuGroupContext, ContextMenuGroupLabelProps } from './types.js';

	let {
		class: className,
		style,
		id: idProp,
		children,
		...rest
	}: ContextMenuGroupLabelProps = $props();

	const fallbackId = useId('context-menu-group-label');
	const id = $derived(idProp ?? fallbackId);

	const group = getContext<ContextMenuGroupContext>(CONTEXT_MENU_GROUP_CONTEXT);

	$effect(() => {
		group.setLabelId(id);
		return () => {
			if (group.labelId === id) {
				group.setLabelId(undefined);
			}
		};
	});

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			class: className,
			style,
		}),
	);
</script>

<div {...mergedProps} style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}>
	{#if children}
		{@render children()}
	{/if}
</div>
