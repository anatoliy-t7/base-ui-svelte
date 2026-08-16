<script lang="ts">
	import { getContext } from 'svelte';
	import { AUTOCOMPLETE_CONTEXT } from '../internal/context-keys.js';
	import { createDismiss } from '../internal/dismiss.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { AutocompleteContext, AutocompletePopupProps } from './types.js';

	let {
		render = 'div',
		class: className,
		style,
		children,
		...rest
	}: AutocompletePopupProps = $props();

	const ctx = getContext<AutocompleteContext>(AUTOCOMPLETE_CONTEXT);

	let popupEl = $state<HTMLElement | null>(null);

	$effect(() => {
		ctx.refs.popup = popupEl;
		return () => {
			if (ctx.refs.popup === popupEl) {
				ctx.refs.popup = null;
			}
		};
	});

	$effect(() => {
		ctx.presence.setNode(popupEl);
		return () => ctx.presence.setNode(null);
	});

	createDismiss({
		get enabled() {
			return ctx.open;
		},
		refs: () => [ctx.refs.popup, ctx.refs.input, ctx.refs.trigger, ctx.refs.positioner],
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
			'data-closed': !ctx.open || ctx.presence.isEnding ? '' : undefined,
			'data-starting-style': ctx.presence.isStarting ? '' : undefined,
			'data-ending-style': ctx.presence.isEnding ? '' : undefined
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
