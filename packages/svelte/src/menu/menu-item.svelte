<script lang="ts">
	import { getContext } from 'svelte';
	import { useId } from '../internal/controllable.svelte.js';
	import { MENU_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { MenuContext, MenuItemProps } from './types.js';

	let {
		disabled = false,
		onClick,
		class: className,
		style,
		id: idProp,
		children,
		...rest
	}: MenuItemProps = $props();

	const fallbackId = useId('menu-item');
	const id = $derived(idProp ?? fallbackId);

	const ctx = getContext<MenuContext>(MENU_CONTEXT);

	let itemEl = $state<HTMLElement | null>(null);

	$effect(() => {
		if (!itemEl) return;
		return ctx.registerItem(id, itemEl, disabled);
	});

	const highlighted = $derived(ctx.highlightedId === id);

	function closeSubmenuOnLeft(event: KeyboardEvent): void {
		if (!ctx.isSubmenu) return;
		event.preventDefault();
		ctx.setOpen(false, 'escape-key');
		ctx.parentMenu?.setHighlighted(ctx.triggerId);
	}

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			role: 'menuitem',
			class: className,
			style,
			tabindex: highlighted ? 0 : -1,
			'aria-disabled': disabled ? 'true' : undefined,
			'data-highlighted': highlighted ? '' : undefined,
			'data-disabled': disabled ? '' : undefined,
			onpointermove: () => {
				if (disabled) return;
				ctx.setHighlighted(id);
				ctx.closeSubmenus();
			},
			onclick: (event: MouseEvent) => {
				if (disabled) {
					event.preventDefault();
					return;
				}
				onClick?.(event);
				ctx.setOpen(false, 'close-press');
				ctx.parentMenu?.setOpen(false, 'close-press');
			},
			onkeydown: (event: KeyboardEvent) => {
				switch (event.key) {
					case 'ArrowDown':
						event.preventDefault();
						ctx.highlightNext();
						break;
					case 'ArrowUp':
						event.preventDefault();
						ctx.highlightPrevious();
						break;
					case 'ArrowLeft':
						closeSubmenuOnLeft(event);
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
						if (!disabled) {
							itemEl?.click();
						}
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
		})
	);
</script>

<div
	{...mergedProps}
	bind:this={itemEl}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
>
	{#if children}
		{@render children()}
	{/if}
</div>
