<script lang="ts">
	import { mergeProps } from '../internal/merge-props.js';
	import type { ContextMenuSeparatorProps } from './types.js';

	let { class: className, style, ...rest }: ContextMenuSeparatorProps = $props();

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			role: 'separator',
			class: className,
			style,
			'aria-orientation': 'horizontal',
		}),
	);
</script>

<div
	{...mergedProps}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
></div>
