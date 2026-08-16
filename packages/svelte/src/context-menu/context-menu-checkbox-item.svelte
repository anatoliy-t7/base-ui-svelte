<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import { createControllableChecked, useId } from '../internal/controllable.svelte.js';
	import {
		CONTEXT_MENU_CHECKBOX_ITEM_CONTEXT,
		CONTEXT_MENU_CONTEXT,
	} from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type {
		ContextMenuCheckboxItemContext,
		ContextMenuCheckboxItemProps,
		ContextMenuContext,
	} from './types.js';

	let {
		checked = $bindable(undefined),
		defaultChecked = false,
		onCheckedChange,
		disabled = false,
		class: className,
		style,
		id: idProp,
		children,
		...rest
	}: ContextMenuCheckboxItemProps = $props();

	const fallbackId = useId('context-menu-checkbox-item');
	const id = $derived(idProp ?? fallbackId);

	const ctx = getContext<ContextMenuContext>(CONTEXT_MENU_CONTEXT);

	const checkedState = createControllableChecked({
		getChecked: () => checked,
		getDefaultChecked: () => defaultChecked,
		onCheckedChange: (next, event) => {
			onCheckedChange?.(next, event);
		},
		setCheckedProp: (next) => {
			checked = next;
		},
	});

	let itemEl = $state<HTMLElement | null>(null);

	$effect(() => {
		if (!itemEl) return;
		return ctx.registerItem(id, itemEl, disabled);
	});

	const highlighted = $derived(ctx.highlightedId === id);

	setContext(CONTEXT_MENU_CHECKBOX_ITEM_CONTEXT, {
		get checked() {
			return checkedState.checked;
		},
		get disabled() {
			return disabled;
		},
	} satisfies ContextMenuCheckboxItemContext);

	function closeSubmenuOnLeft(event: KeyboardEvent): void {
		if (!ctx.isSubmenu) return;
		event.preventDefault();
		ctx.setOpen(false, 'escape-key');
		ctx.parentMenu?.setHighlighted(ctx.triggerId);
	}

	function toggle(event: Event): void {
		if (disabled) return;
		checkedState.setChecked(!checkedState.checked, event);
	}

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			role: 'menuitemcheckbox',
			class: className,
			style,
			tabindex: highlighted ? 0 : -1,
			'aria-checked': checkedState.checked,
			'aria-disabled': disabled ? 'true' : undefined,
			'data-checked': checkedState.checked ? '' : undefined,
			'data-unchecked': !checkedState.checked ? '' : undefined,
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
				toggle(event);
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
						toggle(event);
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
			},
		}),
	);
</script>

<div
	{...mergedProps}
	bind:this={itemEl}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
>
	{#if children}
		{@render children({ checked: checkedState.checked })}
	{/if}
</div>
