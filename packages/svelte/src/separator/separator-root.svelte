<script lang="ts">
	import { mergeProps } from '../internal/merge-props.js';
	import type { SeparatorRootProps } from './types.js';

	let {
		orientation = 'horizontal',
		class: className,
		style,
		...rest
	}: SeparatorRootProps = $props();

	const rootProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			role: 'separator',
			class: className,
			style,
			'data-orientation': orientation,
			'aria-orientation': orientation === 'vertical' ? 'vertical' : undefined
		})
	);
</script>

<div {...rootProps}></div>
