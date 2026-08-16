<script lang="ts">
	import { getContext, tick } from 'svelte';
	import { CONTEXT_MENU_CONTEXT } from '../internal/context-keys.js';
	import { createDismiss } from '../internal/dismiss.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { ContextMenuContext, ContextMenuPopupProps } from './types.js';

	let {
		render = 'div',
		class: className,
		style,
		children,
		...rest
	}: ContextMenuPopupProps = $props();

	const ctx = getContext<ContextMenuContext>(CONTEXT_MENU_CONTEXT);

	let popupEl = $state<HTMLElement | null>(null);
	let focusedOnOpen = false;

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

	$effect(() => {
		if (!ctx.open) {
			focusedOnOpen = false;
			return;
		}
		if (!ctx.presence.isPresent || !popupEl || focusedOnOpen) return;

		focusedOnOpen = true;
		void tick().then(() => {
			queueMicrotask(() => {
				const first = ctx.getItems().find((item) => !item.disabled);
				if (first) {
					ctx.setHighlighted(first.id);
				} else {
					popupEl?.focus();
				}
			});
		});
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

	function onKeyDown(event: KeyboardEvent): void {
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				ctx.highlightNext();
				break;
			case 'ArrowUp':
				event.preventDefault();
				ctx.highlightPrevious();
				break;
			case 'Home':
				event.preventDefault();
				ctx.highlightFirst();
				break;
			case 'End':
				event.preventDefault();
				ctx.highlightLast();
				break;
			case 'Enter':
			case ' ':
				event.preventDefault();
				ctx.activateHighlighted();
				break;
			case 'Escape':
				event.preventDefault();
				ctx.setOpen(false, 'escape-key');
				break;
			case 'Tab':
				event.preventDefault();
				ctx.setOpen(false, 'imperative-action');
				break;
		}
	}

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id: ctx.popupId,
			role: 'menu',
			class: className,
			style,
			tabindex: -1,
			'data-open': ctx.open ? '' : undefined,
			'data-closed': !ctx.open || ctx.presence.isEnding ? '' : undefined,
			'data-starting-style': ctx.presence.isStarting ? '' : undefined,
			'data-ending-style': ctx.presence.isEnding ? '' : undefined,
			onkeydown: onKeyDown
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
