<script lang="ts">
	import { getContext } from 'svelte';
	import { TOAST_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { ToastContext, ToastTitleProps } from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: ToastTitleProps = $props();

	const ctx = getContext<ToastContext>(TOAST_CONTEXT);

	const titleProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style
		})
	);
</script>

<div {...titleProps}>
	{#if children}
		{@render children()}
	{:else if ctx.toast?.title}
		{ctx.toast.title}
	{/if}
</div>
