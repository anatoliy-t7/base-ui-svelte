<script lang="ts">
	import { getContext } from 'svelte';
	import { TOOLBAR_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { ToolbarContext, ToolbarSeparatorProps } from './types.js';

	let {
		orientation: orientationProp,
		class: className,
		style,
		...rest
	}: ToolbarSeparatorProps = $props();

	const ctx = getContext<ToolbarContext>(TOOLBAR_CONTEXT);
	const orientation = $derived(orientationProp ?? ctx.orientation);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			role: 'separator',
			class: className,
			style,
			'aria-orientation': orientation === 'vertical' ? 'vertical' : undefined,
			'data-orientation': orientation,
		}),
	);
</script>

<div
	{...mergedProps}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
></div>
