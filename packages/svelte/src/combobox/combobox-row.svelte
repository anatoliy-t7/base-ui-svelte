<script lang="ts">
	import { mergeProps } from '../internal/merge-props.js';
	import type { ComboboxRowProps } from './types.js';

	let { class: className, style, children, ...rest }: ComboboxRowProps = $props();

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			role: 'presentation',
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
