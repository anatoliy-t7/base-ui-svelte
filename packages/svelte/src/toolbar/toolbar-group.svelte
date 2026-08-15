<script lang="ts">
	import { getContext } from 'svelte';
	import { TOOLBAR_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { ToolbarContext, ToolbarGroupProps } from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: ToolbarGroupProps = $props();

	const ctx = getContext<ToolbarContext>(TOOLBAR_CONTEXT);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			role: 'group',
			class: className,
			style,
			'data-orientation': ctx.orientation
		})
	);
</script>

<div {...mergedProps} style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}>
	{#if children}
		{@render children()}
	{/if}
</div>
