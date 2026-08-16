<script lang="ts">
	import { getContext } from 'svelte';
	import { COMBOBOX_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { ComboboxContext, ComboboxTriggerProps } from './types.js';

	let {
		render = 'button',
		disabled = false,
		class: className,
		style,
		children,
		...rest
	}: ComboboxTriggerProps = $props();

	const ctx = getContext<ComboboxContext>(COMBOBOX_CONTEXT);

	let triggerEl = $state<HTMLElement | null>(null);

	const isDisabled = $derived(Boolean(disabled || ctx.disabled));

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
			type: render === 'button' ? 'button' : undefined,
			class: className,
			style,
			disabled: isDisabled || undefined,
			tabindex: -1,
			'aria-label': 'Toggle list',
			'aria-expanded': ctx.open,
			'aria-controls': ctx.listId,
			'data-open': ctx.open ? '' : undefined,
			'data-closed': !ctx.open ? '' : undefined,
			'data-disabled': isDisabled ? '' : undefined,
			onclick: () => {
				if (isDisabled) return;
				ctx.setOpen(!ctx.open, 'trigger-press');
				ctx.refs.input?.focus();
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
