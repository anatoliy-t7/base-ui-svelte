<script lang="ts">
	import { getContext, hasContext } from 'svelte';
	import { useId } from '../internal/controllable.svelte.js';
	import { MENU_CONTEXT, MENUBAR_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { MenubarContext } from '../menubar/types.js';
	import type { MenuContext, MenuTriggerProps } from './types.js';

	let {
		render = 'button',
		disabled = false,
		id,
		handle,
		payload,
		openOnHover = false,
		class: className,
		style,
		children,
		...rest
	}: MenuTriggerProps = $props();

	const ctx = hasContext(MENU_CONTEXT)
		? getContext<MenuContext>(MENU_CONTEXT)
		: undefined;
	const menubar = hasContext(MENUBAR_CONTEXT)
		? getContext<MenubarContext>(MENUBAR_CONTEXT)
		: undefined;

	const fallbackId = useId('menu-trigger');
	const resolvedId = $derived(id ?? ctx?.triggerId ?? fallbackId);

	const hoverEnabled = $derived(
		openOnHover || ctx?.openOnHover || Boolean(menubar?.openOnHover),
	);
	const isDisabled = $derived(Boolean(disabled || ctx?.disabled));

	let triggerEl = $state<HTMLElement | null>(null);

	$effect(() => {
		if (!ctx) return;
		ctx.refs.trigger = triggerEl;
		return () => {
			if (ctx.refs.trigger === triggerEl) {
				ctx.refs.trigger = null;
			}
		};
	});

	$effect(() => {
		if (!menubar || !ctx || !triggerEl) return;
		return menubar.registerTrigger(ctx.menuId, triggerEl);
	});

	const isOpen = $derived(ctx?.open ?? handle?.isOpen ?? false);

	function onKeyDown(event: KeyboardEvent): void {
		if (!menubar || !ctx || isDisabled) return;

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
			id: resolvedId,
			type: render === 'button' ? 'button' : undefined,
			class: className,
			style,
			disabled: isDisabled || undefined,
			role: menubar && ctx ? 'menuitem' : undefined,
			'aria-haspopup': 'menu',
			'aria-expanded': isOpen,
			'aria-controls': ctx?.popupId,
			'data-open': isOpen ? '' : undefined,
			'data-closed': !isOpen ? '' : undefined,
			'data-disabled': isDisabled ? '' : undefined,
			onclick: () => {
				if (isDisabled) return;
				if (handle && payload !== undefined) {
					handle.openWithPayload(payload);
					return;
				}
				if (handle && !ctx) {
					handle.open(resolvedId);
					return;
				}
				if (ctx) {
					ctx.setOpen(!ctx.open, 'trigger-press');
				}
			},
			onkeydown: onKeyDown,
			onpointerenter: () => {
				if (isDisabled || !hoverEnabled || !ctx) return;
				if (menubar) {
					menubar.cancelClose();
					ctx.setOpen(true, 'trigger-hover');
					return;
				}
				ctx.openWithHoverDelay('trigger-hover');
			},
			onpointerleave: () => {
				if (isDisabled || !hoverEnabled || !ctx) return;
				ctx.closeWithHoverDelay('trigger-hover');
			},
		}),
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
