<script lang="ts">
	import { getContext } from 'svelte';
	import { DIALOG_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { DialogCloseProps, DialogContext } from './types.js';

	let {
		render = 'button',
		class: className,
		style,
		children,
		...rest
	}: DialogCloseProps = $props();

	const ctx = getContext<DialogContext>(DIALOG_CONTEXT);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			type: render === 'button' ? 'button' : undefined,
			class: className,
			style,
			onclick: () => {
				ctx.setOpen(false, 'close-press');
			},
		}),
	);
</script>

<svelte:element
	this={render}
	{...mergedProps}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
>
	{#if children}
		{@render children()}
	{/if}
</svelte:element>
