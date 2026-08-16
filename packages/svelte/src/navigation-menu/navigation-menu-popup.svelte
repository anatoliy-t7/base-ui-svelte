<script lang="ts">
	import { getContext } from 'svelte';
	import { NAVIGATION_MENU_CONTEXT } from '../internal/context-keys.js';
	import { createDismiss } from '../internal/dismiss.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { NavigationMenuContext, NavigationMenuPopupProps } from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: NavigationMenuPopupProps = $props();

	const ctx = getContext<NavigationMenuContext>(NAVIGATION_MENU_CONTEXT);

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
		refs: () => [
			ctx.refs.popup,
			ctx.refs.positioner,
			ctx.refs.list,
			...Array.from(ctx.refs.triggers.values())
		],
		onDismiss: () => {
			ctx.close();
		},
		dismissOnEscape: true,
		dismissOnOutsidePress: true
	});

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id: ctx.popupId,
			class: className,
			style,
			'data-open': ctx.open ? '' : undefined,
			'data-closed': !ctx.open || ctx.presence.isEnding ? '' : undefined,
			'data-starting-style': ctx.presence.isStarting ? '' : undefined,
			'data-ending-style': ctx.presence.isEnding ? '' : undefined,
			onpointerenter: () => {
				ctx.cancelClose();
			},
			onpointerleave: () => {
				ctx.closeWithDelay();
			}
		})
	);
</script>

{#if ctx.presence.isPresent}
	<div
		{...mergedProps}
		bind:this={popupEl}
		style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
	>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
