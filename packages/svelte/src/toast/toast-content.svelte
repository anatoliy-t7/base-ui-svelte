<script lang="ts">
	import { mergeProps } from '../internal/merge-props.js';
	import type { ToastContentProps } from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: ToastContentProps = $props();

	const contentProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style
		})
	);
</script>

<div {...contentProps}>
	{#if children}
		{@render children()}
	{/if}
</div>
