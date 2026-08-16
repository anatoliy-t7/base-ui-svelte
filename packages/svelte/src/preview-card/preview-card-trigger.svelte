<script lang="ts">
	import { getContext, hasContext } from 'svelte';
	import { useId } from '../internal/controllable.svelte.js';
	import { PREVIEW_CARD_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { PreviewCardContext, PreviewCardTriggerProps } from './types.js';

	let {
		render = 'a',
		disabled = false,
		id,
		handle,
		payload,
		class: className,
		style,
		children,
		...rest
	}: PreviewCardTriggerProps = $props();

	const ctx = hasContext(PREVIEW_CARD_CONTEXT)
		? getContext<PreviewCardContext>(PREVIEW_CARD_CONTEXT)
		: undefined;

	const fallbackId = useId('preview-card-trigger');
	const resolvedId = $derived(id ?? ctx?.triggerId ?? fallbackId);

	let triggerEl = $state<HTMLElement | null>(null);

	$effect(() => {
		if (!ctx) return;
		ctx.refs.trigger = triggerEl;
		return () => {
			if (ctx.refs.trigger === triggerEl) {
				ctx.refs.trigger = null;
			}
		};
	});

	const isOpen = $derived(ctx?.open ?? handle?.isOpen ?? false);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id: resolvedId,
			type: render === 'button' ? 'button' : undefined,
			class: className,
			style,
			disabled: disabled || undefined,
			'aria-describedby': isOpen ? (ctx?.popupId ?? undefined) : undefined,
			'data-open': isOpen ? '' : undefined,
			'data-closed': !isOpen ? '' : undefined,
			'data-disabled': disabled ? '' : undefined,
			onclick: () => {
				if (disabled) return;
				if (handle && payload !== undefined) {
					handle.openWithPayload(payload);
					return;
				}
				if (handle && !ctx) {
					handle.open(resolvedId);
				}
			},
			onpointerenter: () => {
				if (disabled || !ctx) return;
				ctx.openWithDelay('trigger-hover');
			},
			onpointerleave: () => {
				if (disabled || !ctx) return;
				ctx.closeWithDelay('trigger-hover');
			},
			onfocus: () => {
				if (disabled || !ctx) return;
				ctx.openWithDelay('trigger-focus');
			},
			onblur: () => {
				if (disabled || !ctx) return;
				ctx.closeWithDelay('trigger-focus');
			},
		}),
	);
</script>

<svelte:element
	this={render}
	{...mergedProps}
	bind:this={triggerEl}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
>
	{#if children}
		{@render children()}
	{/if}
</svelte:element>
