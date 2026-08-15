<script lang="ts">
	import { mergeProps } from '../internal/merge-props.js';
	import type { ToastViewportProps } from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: ToastViewportProps = $props();

	const viewportProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			role: 'region',
			'aria-label': 'Notifications',
			class: className,
			style
		})
	);
</script>

<div {...viewportProps}>
	{#if children}
		{@render children()}
	{/if}
</div>
