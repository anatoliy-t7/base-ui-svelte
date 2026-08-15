<script lang="ts">
	import { mergeProps } from '../internal/merge-props.js';
	import type { MenuSeparatorProps } from './types.js';

	let {
		class: className,
		style,
		...rest
	}: MenuSeparatorProps = $props();

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			role: 'separator',
			class: className,
			style,
			'aria-orientation': 'horizontal'
		})
	);
</script>

<div {...mergedProps} style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}></div>
