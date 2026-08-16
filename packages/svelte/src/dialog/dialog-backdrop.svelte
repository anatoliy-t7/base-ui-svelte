<script lang="ts">
	import { getContext } from 'svelte';
	import { DIALOG_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { DialogBackdropProps, DialogContext } from './types.js';

	let {
		render = 'div',
		class: className,
		style,
		forceRender = false,
		children,
		...rest
	}: DialogBackdropProps = $props();

	const ctx = getContext<DialogContext>(DIALOG_CONTEXT);

	const shouldRender = $derived(forceRender || ctx.presence.isPresent);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style: ['position:fixed;inset:0;', typeof style === 'string' ? style : undefined]
				.filter(Boolean)
				.join(';'),
			hidden: forceRender && !ctx.presence.isPresent ? true : undefined,
			'data-open': ctx.open ? '' : undefined,
			'data-closed': !ctx.open || ctx.presence.isEnding ? '' : undefined,
			'data-starting-style': ctx.presence.isStarting ? '' : undefined,
			'data-ending-style': ctx.presence.isEnding ? '' : undefined,
			onclick: () => {
				if (ctx.disablePointerDismissal) return;
				ctx.setOpen(false, 'outside-press');
			},
		}),
	);
</script>

{#if shouldRender}
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
