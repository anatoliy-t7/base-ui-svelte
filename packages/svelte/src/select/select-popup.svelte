<script lang="ts">
	import { getContext } from 'svelte';
	import { SELECT_CONTEXT } from '../internal/context-keys.js';
	import { createDismiss } from '../internal/dismiss.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { SelectContext, SelectPopupProps } from './types.js';

	let {
		render = 'div',
		class: className,
		style,
		children,
		...rest
	}: SelectPopupProps = $props();

	const ctx = getContext<SelectContext>(SELECT_CONTEXT);

	let popupEl = $state<HTMLElement | null>(null);

	$effect(() => {
		ctx.refs.popup = popupEl;
		return () => {
			if (ctx.refs.popup === popupEl) {
				ctx.refs.popup = null;
			}
		};
	});

	createDismiss({
		get enabled() {
			return ctx.open;
		},
		refs: () => [ctx.refs.popup, ctx.refs.trigger, ctx.refs.positioner],
		onDismiss: (event) => {
			const reason = event instanceof KeyboardEvent ? 'escape-key' : 'outside-press';
			ctx.setOpen(false, reason);
		},
		dismissOnEscape: true,
		dismissOnOutsidePress: true
	});

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			role: 'presentation',
			class: className,
			style,
			'data-open': ctx.open ? '' : undefined,
			'data-closed': !ctx.open ? '' : undefined
		})
	);
</script>

{#if ctx.presence.isPresent}
	<svelte:element
		this={render}
		{...mergedProps}
		bind:this={popupEl}
		style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
	>
		{#if children}
			{@render children()}
		{/if}
	</svelte:element>
{/if}
