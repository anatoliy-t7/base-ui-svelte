<script lang="ts">
	import { mergeProps } from '../internal/merge-props.js';
	import type { AutocompleteRowProps } from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: AutocompleteRowProps = $props();

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			role: 'presentation',
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
