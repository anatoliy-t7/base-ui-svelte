<script lang="ts">
	import { mergeProps } from '../internal/merge-props.js';
	import type { OtpFieldSeparatorProps } from './types.js';

	let { orientation = 'horizontal', class: className, style, children, ...rest }: OtpFieldSeparatorProps = $props();

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			role: 'separator',
			class: className,
			style,
			'aria-hidden': 'true',
			'aria-orientation': orientation,
			'data-orientation': orientation,
		}),
	);
</script>

<div {...mergedProps} style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}>
	{#if children}
		{@render children()}
	{:else}
		-
	{/if}
</div>
