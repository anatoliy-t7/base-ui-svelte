<script lang="ts">
	import { getContext } from 'svelte';
	import { ALERT_DIALOG_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { AlertDialogContext, AlertDialogTriggerProps } from './types.js';

	let {
		render = 'button',
		disabled = false,
		class: className,
		style,
		children,
		...rest
	}: AlertDialogTriggerProps = $props();

	const ctx = getContext<AlertDialogContext>(ALERT_DIALOG_CONTEXT);

	let triggerEl = $state<HTMLElement | null>(null);

	$effect(() => {
		ctx.refs.trigger = triggerEl;
		return () => {
			if (ctx.refs.trigger === triggerEl) {
				ctx.refs.trigger = null;
			}
		};
	});

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id: ctx.triggerId,
			type: render === 'button' ? 'button' : undefined,
			class: className,
			style,
			disabled: disabled || undefined,
			'aria-haspopup': 'dialog',
			'aria-expanded': ctx.open,
			'aria-controls': ctx.popupId,
			'data-open': ctx.open ? '' : undefined,
			'data-closed': !ctx.open ? '' : undefined,
			'data-disabled': disabled ? '' : undefined,
			onclick: () => {
				if (disabled) return;
				ctx.setOpen(!ctx.open, 'trigger-press');
			}
		})
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
