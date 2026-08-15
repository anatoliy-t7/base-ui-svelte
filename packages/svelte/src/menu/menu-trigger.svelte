<script lang="ts">
	import { getContext, hasContext } from 'svelte';
	import { MENU_CONTEXT, MENUBAR_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { MenubarContext } from '../menubar/types.js';
	import type { MenuContext, MenuTriggerProps } from './types.js';

	let {
		render = 'button',
		disabled = false,
		openOnHover = false,
		class: className,
		style,
		children,
		...rest
	}: MenuTriggerProps = $props();

	const ctx = getContext<MenuContext>(MENU_CONTEXT);
	const menubar = hasContext(MENUBAR_CONTEXT)
		? getContext<MenubarContext>(MENUBAR_CONTEXT)
		: undefined;

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
		if (!menubar || !triggerEl) return;
		return menubar.registerTrigger(ctx.menuId, triggerEl);
	});

	function onKeyDown(event: KeyboardEvent): void {
		if (!menubar || disabled) return;

		const horizontal = menubar.orientation === 'horizontal';
		const nextKey = horizontal ? 'ArrowRight' : 'ArrowDown';
		const prevKey = horizontal ? 'ArrowLeft' : 'ArrowUp';

		if (event.key === nextKey) {
			event.preventDefault();
			menubar.moveFocus(ctx.menuId, 1);
			return;
		}
		if (event.key === prevKey) {
			event.preventDefault();
			menubar.moveFocus(ctx.menuId, -1);
		}
	}

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id: ctx.triggerId,
			type: render === 'button' ? 'button' : undefined,
			class: className,
			style,
			disabled: disabled || undefined,
			role: menubar ? 'menuitem' : undefined,
			'aria-haspopup': 'menu',
			'aria-expanded': ctx.open,
			'aria-controls': ctx.popupId,
			'data-open': ctx.open ? '' : undefined,
			'data-closed': !ctx.open ? '' : undefined,
			'data-disabled': disabled ? '' : undefined,
			onclick: () => {
				if (disabled) return;
				ctx.setOpen(!ctx.open, 'trigger-press');
			},
			onkeydown: onKeyDown,
			onpointerenter: () => {
				if (disabled) return;
				if (openOnHover || menubar?.openOnHover) {
					ctx.setOpen(true, 'trigger-hover');
				}
			}
		})
	);
</script>

<svelte:element
	this={render}
	{...mergedProps}
	bind:this={triggerEl}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
>
	{#if children}
		{@render children()}
	{/if}
</svelte:element>
