<script lang="ts">
	import { getContext } from 'svelte';
	import { DIALOG_CONTEXT } from '../internal/context-keys.js';
	import { createDismiss } from '../internal/dismiss.svelte.js';
	import { createFocusTrap } from '../internal/focus-trap.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { DialogContext, DialogPopupProps } from './types.js';

	let {
		render = 'div',
		class: className,
		style,
		children,
		...rest
	}: DialogPopupProps = $props();

	const ctx = getContext<DialogContext>(DIALOG_CONTEXT);

	let popupEl = $state<HTMLElement | null>(null);

	$effect(() => {
		ctx.refs.popup = popupEl;
		return () => {
			if (ctx.refs.popup === popupEl) {
				ctx.refs.popup = null;
			}
		};
	});

	createFocusTrap({
		get enabled() {
			return ctx.open;
		},
		container: () => ctx.refs.popup,
		restoreFocus: true
	});

	createDismiss({
		get enabled() {
			return ctx.open;
		},
		refs: () => [ctx.refs.popup, ctx.refs.trigger],
		onDismiss: (event) => {
			const reason = event instanceof KeyboardEvent ? 'escape-key' : 'outside-press';
			ctx.setOpen(false, reason);
		},
		dismissOnEscape: true,
		dismissOnOutsidePress: false
	});

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id: ctx.popupId,
			role: 'dialog',
			class: className,
			style,
			tabindex: -1,
			'aria-modal': 'true',
			'aria-labelledby': ctx.titleId,
			'aria-describedby': ctx.descriptionId,
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
