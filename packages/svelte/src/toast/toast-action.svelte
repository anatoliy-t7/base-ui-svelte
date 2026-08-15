<script lang="ts">
	import { getContext } from 'svelte';
	import { TOAST_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { ToastActionProps, ToastContext } from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: ToastActionProps = $props();

	const ctx = getContext<ToastContext>(TOAST_CONTEXT);
	const actionProps = $derived(ctx.toast?.actionProps);
	const shouldRender = $derived(Boolean(children) || Boolean(actionProps?.children));

	const buttonProps: Record<string, unknown> = $derived(
		mergeProps(actionProps ?? {}, rest, {
			type: 'button',
			class: className,
			style
		})
	);
</script>

{#if shouldRender}
	<button {...buttonProps}>
		{#if children}
			{@render children()}
		{:else if typeof actionProps?.children === 'string'}
			{actionProps.children}
		{/if}
	</button>
{/if}
