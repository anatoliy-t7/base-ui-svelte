<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import { TOAST_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { ToastContext, ToastRootProps } from './types.js';

	let {
		toast,
		class: className,
		style,
		children,
		...rest
	}: ToastRootProps = $props();

	const parent = getContext<ToastContext>(TOAST_CONTEXT);

	setContext(TOAST_CONTEXT, {
		get toasts() {
			return parent.toasts;
		},
		add: (data) => parent.add(data),
		close: (id) => parent.close(id),
		get toast() {
			return toast;
		}
	} satisfies ToastContext);

	const rootProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			role: 'status',
			class: className,
			style,
			'data-open': ''
		})
	);
</script>

<div {...rootProps}>
	{#if children}
		{@render children()}
	{/if}
</div>
