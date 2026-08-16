<script lang="ts">
	import { getContext } from 'svelte';
	import { TOAST_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { ToastContentProps, ToastContext } from './types.js';

	let { class: className, style, children, ...rest }: ToastContentProps = $props();

	const ctx = getContext<ToastContext>(TOAST_CONTEXT);

	let contentEl = $state<HTMLElement | null>(null);

	const behind = $derived(ctx.toastVisibleIndex > 0);
	const expanded = $derived(ctx.expanded);

	$effect(() => {
		const node = contentEl;
		const toast = ctx.toast;
		if (!node || !toast) return;

		ctx.updateHeight(toast.id, node.parentElement?.offsetHeight ?? node.offsetHeight);

		if (typeof ResizeObserver !== 'function') return;

		const resizeObserver = new ResizeObserver(() => {
			const parentEl = node.parentElement;
			if (!parentEl) return;
			const previous = parentEl.style.height;
			parentEl.style.height = 'auto';
			const height = parentEl.offsetHeight;
			parentEl.style.height = previous;
			ctx.updateHeight(toast.id, height);
		});
		resizeObserver.observe(node);
		return () => resizeObserver.disconnect();
	});

	const contentProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style,
			'data-behind': behind ? '' : undefined,
			'data-expanded': expanded ? '' : undefined,
		}),
	);
</script>

<div {...contentProps} bind:this={contentEl}>
	{#if children}
		{@render children()}
	{/if}
</div>
