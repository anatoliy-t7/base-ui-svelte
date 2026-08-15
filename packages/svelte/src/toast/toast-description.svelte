<script lang="ts">
	import { getContext } from 'svelte';
	import { TOAST_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { ToastContext, ToastDescriptionProps } from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: ToastDescriptionProps = $props();

	const ctx = getContext<ToastContext>(TOAST_CONTEXT);

	const descriptionProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style
		})
	);
</script>

<div {...descriptionProps}>
	{#if children}
		{@render children()}
	{:else if ctx.toast?.description}
		{ctx.toast.description}
	{/if}
</div>
