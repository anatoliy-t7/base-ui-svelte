<script lang="ts">
	import { getContext } from 'svelte';
	import { CONTEXT_MENU_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { ContextMenuContext, ContextMenuSubmenuTriggerProps } from './types.js';

	let {
		disabled = false,
		class: className,
		style,
		children,
		...rest
	}: ContextMenuSubmenuTriggerProps = $props();

	const ctx = getContext<ContextMenuContext>(CONTEXT_MENU_CONTEXT);
	const parentMenu = ctx.parentMenu;

	let triggerEl = $state<HTMLElement | null>(null);

	$effect(() => {
		ctx.refs.trigger = triggerEl;
		return () => {
			if (ctx.refs.trigger === triggerEl) {
				ctx.refs.trigger = null;
			}
		};
	});

	$effect(() => {
		if (!triggerEl || !parentMenu) return;
		return parentMenu.registerItem(ctx.triggerId, triggerEl, disabled);
	});

	const highlighted = $derived(parentMenu ? parentMenu.highlightedId === ctx.triggerId : false);

	function openSubmenu(reason: 'trigger-hover' | 'trigger-press' | 'imperative-action'): void {
		if (disabled || !parentMenu) return;
		parentMenu.closeSubmenus(ctx.menuId);
		ctx.setOpen(true, reason);
	}

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id: ctx.triggerId,
			role: 'menuitem',
			class: className,
			style,
			tabindex: highlighted ? 0 : -1,
			'aria-haspopup': 'menu',
			'aria-expanded': ctx.open,
			'aria-controls': ctx.popupId,
			'aria-disabled': disabled ? 'true' : undefined,
			'data-highlighted': highlighted ? '' : undefined,
			'data-open': ctx.open ? '' : undefined,
			'data-closed': !ctx.open ? '' : undefined,
			'data-disabled': disabled ? '' : undefined,
			onpointermove: () => {
				if (disabled || !parentMenu) return;
				parentMenu.setHighlighted(ctx.triggerId);
			},
			onpointerenter: () => {
				openSubmenu('trigger-hover');
			},
			onclick: (event: MouseEvent) => {
				if (disabled) {
					event.preventDefault();
					return;
				}
				event.preventDefault();
				openSubmenu('trigger-press');
			},
			onkeydown: (event: KeyboardEvent) => {
				if (!parentMenu) return;
				switch (event.key) {
					case 'ArrowDown':
						event.preventDefault();
						parentMenu.highlightNext();
						break;
					case 'ArrowUp':
						event.preventDefault();
						parentMenu.highlightPrevious();
						break;
					case 'ArrowRight':
						event.preventDefault();
						openSubmenu('imperative-action');
						break;
					case 'Home':
						event.preventDefault();
						parentMenu.highlightFirst();
						break;
					case 'End':
						event.preventDefault();
						parentMenu.highlightLast();
						break;
					case 'Enter':
					case ' ':
						event.preventDefault();
						openSubmenu('trigger-press');
						break;
					case 'Escape':
						event.preventDefault();
						parentMenu.setOpen(false, 'escape-key');
						break;
					case 'Tab':
						event.preventDefault();
						parentMenu.setOpen(false, 'imperative-action');
						break;
				}
			},
		}),
	);
</script>

<div
	{...mergedProps}
	bind:this={triggerEl}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
>
	{#if children}
		{@render children()}
	{/if}
</div>
