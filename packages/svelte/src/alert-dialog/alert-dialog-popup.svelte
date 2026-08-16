<script lang="ts">
	import { getContext } from 'svelte';
	import { ALERT_DIALOG_CONTEXT } from '../internal/context-keys.js';
	import { createDismiss } from '../internal/dismiss.svelte.js';
	import { createFocusTrap } from '../internal/focus-trap.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import { createScrollLock } from '../internal/scroll-lock.svelte.js';
	import type { AlertDialogContext, AlertDialogPopupProps } from './types.js';

	let {
		render = 'div',
		class: className,
		style,
		initialFocus,
		finalFocus,
		children,
		...rest
	}: AlertDialogPopupProps = $props();

	const ctx = getContext<AlertDialogContext>(ALERT_DIALOG_CONTEXT);

	let popupEl = $state<HTMLElement | null>(null);

	const trapFocus = $derived(ctx.modal === true || ctx.modal === 'trap-focus');
	const ariaModal = $derived(ctx.modal === true);

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

	createFocusTrap({
		get enabled() {
			return ctx.open && trapFocus;
		},
		container: () => ctx.refs.popup,
		restoreFocus: true,
		get initialFocus() {
			return initialFocus;
		},
		get finalFocus() {
			return finalFocus;
		},
	});

	createScrollLock({
		get enabled() {
			return ctx.open && ariaModal;
		},
		reference: () => popupEl,
	});

	createDismiss({
		get enabled() {
			return ctx.open;
		},
		refs: () => [ctx.refs.popup, ctx.refs.trigger],
		onDismiss: (event) => {
			const reason = event instanceof KeyboardEvent ? 'escape-key' : 'outside-press';
			if (reason === 'outside-press' && ctx.disablePointerDismissal) return;
			ctx.setOpen(false, reason);
		},
		dismissOnEscape: true,
		dismissOnOutsidePress: false,
	});

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id: ctx.popupId,
			role: 'alertdialog',
			class: className,
			style,
			tabindex: -1,
			'aria-modal': ariaModal ? 'true' : undefined,
			'aria-labelledby': ctx.titleId,
			'aria-describedby': ctx.descriptionId,
			'data-open': ctx.open ? '' : undefined,
			'data-closed': !ctx.open || ctx.presence.isEnding ? '' : undefined,
			'data-starting-style': ctx.presence.isStarting ? '' : undefined,
			'data-ending-style': ctx.presence.isEnding ? '' : undefined,
		}),
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
