<script lang="ts">
	import { getContext, hasContext } from 'svelte';
	import { useId } from '../internal/controllable.svelte.js';
	import { DRAWER_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { DrawerContext, DrawerTriggerProps } from './types.js';

	let {
		render = 'button',
		disabled = false,
		id,
		handle,
		payload,
		class: className,
		style,
		children,
		...rest
	}: DrawerTriggerProps = $props();

	const ctx = hasContext(DRAWER_CONTEXT)
		? getContext<DrawerContext>(DRAWER_CONTEXT)
		: undefined;

	const fallbackId = useId('drawer-trigger');
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
			'aria-haspopup': 'dialog',
			'aria-expanded': isOpen,
			'aria-controls': ctx?.popupId,
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
					return;
				}
				if (ctx) {
					ctx.setOpen(!ctx.open, 'trigger-press');
				}
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
