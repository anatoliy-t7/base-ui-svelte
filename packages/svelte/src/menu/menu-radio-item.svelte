<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import { useId } from '../internal/controllable.svelte.js';
	import {
		MENU_CONTEXT,
		MENU_RADIO_GROUP_CONTEXT,
		MENU_RADIO_ITEM_CONTEXT
	} from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type {
		MenuContext,
		MenuRadioGroupContext,
		MenuRadioItemContext,
		MenuRadioItemProps
	} from './types.js';

	let {
		value,
		disabled = false,
		class: className,
		style,
		id: idProp,
		children,
		...rest
	}: MenuRadioItemProps = $props();

	const fallbackId = useId('menu-radio-item');
	const id = $derived(idProp ?? fallbackId);

	const ctx = getContext<MenuContext>(MENU_CONTEXT);
	const group = getContext<MenuRadioGroupContext>(MENU_RADIO_GROUP_CONTEXT);

	const isDisabled = $derived(Boolean(disabled || group.disabled));
	const isChecked = $derived(group.value === value);

	let itemEl = $state<HTMLElement | null>(null);

	$effect(() => {
		if (!itemEl) return;
		return ctx.registerItem(id, itemEl, isDisabled);
	});

	const highlighted = $derived(ctx.highlightedId === id);

	setContext(MENU_RADIO_ITEM_CONTEXT, {
		get checked() {
			return isChecked;
		},
		get disabled() {
			return isDisabled;
		}
	} satisfies MenuRadioItemContext);

	function closeSubmenuOnLeft(event: KeyboardEvent): void {
		if (!ctx.isSubmenu) return;
		event.preventDefault();
		ctx.setOpen(false, 'escape-key');
		ctx.parentMenu?.setHighlighted(ctx.triggerId);
	}

	function select(event: Event): void {
		if (isDisabled) return;
		group.setValue(value, event);
	}

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			role: 'menuitemradio',
			class: className,
			style,
			tabindex: highlighted ? 0 : -1,
			'aria-checked': isChecked,
			'aria-disabled': isDisabled ? 'true' : undefined,
			'data-checked': isChecked ? '' : undefined,
			'data-unchecked': !isChecked ? '' : undefined,
			'data-highlighted': highlighted ? '' : undefined,
			'data-disabled': isDisabled ? '' : undefined,
			onpointermove: () => {
				if (isDisabled) return;
				ctx.setHighlighted(id);
				ctx.closeSubmenus();
			},
			onclick: (event: MouseEvent) => {
				if (isDisabled) {
					event.preventDefault();
					return;
				}
				select(event);
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
						select(event);
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
		{@render children({ checked: isChecked })}
	{/if}
</div>
