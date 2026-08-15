<script lang="ts">
	import { mergeProps } from '../internal/merge-props.js';
	import type { ComboboxChipsProps } from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: ComboboxChipsProps = $props();

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style
		})
	);
</script>

<div {...mergedProps} style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}>
	{#if children}
		{@render children()}
	{/if}
</div>
