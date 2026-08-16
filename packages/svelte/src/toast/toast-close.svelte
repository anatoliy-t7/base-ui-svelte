<script lang="ts">
	import { getContext } from 'svelte';
	import { TOAST_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { ToastCloseProps, ToastContext } from './types.js';

	let { class: className, style, children, ...rest }: ToastCloseProps = $props();

	const ctx = getContext<ToastContext>(TOAST_CONTEXT);

	const closeProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			type: 'button',
			class: className,
			style,
			'aria-label': 'Close',
			onclick: () => {
				if (ctx.toast) {
					ctx.close(ctx.toast.id);
				}
			},
		}),
	);
</script>

<button {...closeProps}>
	{#if children}
		{@render children()}
	{:else}
		×
	{/if}
</button>
