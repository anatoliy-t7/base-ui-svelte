<script lang="ts">
	import { getContext } from 'svelte';
	import { DIALOG_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { DialogBackdropProps, DialogContext } from './types.js';

	let {
		render = 'div',
		class: className,
		style,
		children,
		...rest
	}: DialogBackdropProps = $props();

	const ctx = getContext<DialogContext>(DIALOG_CONTEXT);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style: [
				'position:fixed;inset:0;',
				typeof style === 'string' ? style : undefined
			]
				.filter(Boolean)
				.join(';'),
			'data-open': ctx.open ? '' : undefined,
			'data-closed': !ctx.open ? '' : undefined,
			onclick: () => {
				ctx.setOpen(false, 'outside-press');
			}
		})
	);
</script>

{#if ctx.presence.isPresent}
	<svelte:element
		this={render}
		{...mergedProps}
		style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
	>
		{#if children}
			{@render children()}
		{/if}
	</svelte:element>
{/if}
