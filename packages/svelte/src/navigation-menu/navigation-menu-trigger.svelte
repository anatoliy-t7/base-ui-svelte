<script lang="ts">
	import { getContext } from 'svelte';
	import {
		NAVIGATION_MENU_CONTEXT,
		NAVIGATION_MENU_ITEM_CONTEXT,
	} from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type {
		NavigationMenuContext,
		NavigationMenuItemContext,
		NavigationMenuTriggerProps,
	} from './types.js';

	let {
		disabled = false,
		class: className,
		style,
		children,
		...rest
	}: NavigationMenuTriggerProps = $props();

	const root = getContext<NavigationMenuContext>(NAVIGATION_MENU_CONTEXT);
	const item = getContext<NavigationMenuItemContext>(NAVIGATION_MENU_ITEM_CONTEXT);

	let triggerEl = $state<HTMLButtonElement | null>(null);

	$effect(() => {
		if (!triggerEl) return;
		return root.registerTrigger(item.value, triggerEl);
	});

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id: item.triggerId,
			type: 'button',
			class: className,
			style,
			disabled: disabled || undefined,
			'aria-expanded': item.open,
			'aria-controls': root.popupId,
			role: 'menuitem',
			'data-open': item.open ? '' : undefined,
			'data-closed': !item.open ? '' : undefined,
			'data-disabled': disabled ? '' : undefined,
			onclick: () => {
				if (disabled) return;
				root.openItem(item.value);
			},
			onpointerenter: () => {
				if (disabled) return;
				root.cancelClose();
				if (root.open) {
					root.openItem(item.value);
				} else {
					root.openWithDelay(item.value);
				}
			},
			onpointerleave: () => {
				if (disabled) return;
				root.closeWithDelay();
			},
			onfocus: () => {
				root.cancelClose();
			},
		}),
	);
</script>

<button
	{...mergedProps}
	bind:this={triggerEl}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
>
	{#if children}
		{@render children()}
	{/if}
</button>
