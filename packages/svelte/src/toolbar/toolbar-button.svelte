<script lang="ts">
	import { getContext, hasContext } from 'svelte';
	import { useId } from '../internal/controllable.svelte.js';
	import { DIRECTION_CONTEXT, TOOLBAR_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { DirectionContext } from '../direction-provider/types.js';
	import type { ToolbarButtonProps, ToolbarContext } from './types.js';

	let {
		disabled = false,
		focusableWhenDisabled = true,
		type = 'button',
		class: className,
		style,
		id: idProp,
		children,
		...rest
	}: ToolbarButtonProps = $props();

	const fallbackId = useId('toolbar-button');
	const id = $derived(idProp ?? fallbackId);

	const ctx = getContext<ToolbarContext>(TOOLBAR_CONTEXT);
	const directionContext = hasContext(DIRECTION_CONTEXT)
		? getContext<DirectionContext>(DIRECTION_CONTEXT)
		: undefined;

	const isFocusable = $derived(!disabled || focusableWhenDisabled);
	const useAriaDisabled = $derived(disabled && focusableWhenDisabled);
	const nativeDisabled = $derived(disabled && !focusableWhenDisabled);

	function onToolbarKeyDown(event: KeyboardEvent): void {
		if (!isFocusable) return;
		const direction = directionContext?.direction ?? 'ltr';
		const rtl = direction === 'rtl' && ctx.orientation === 'horizontal';
		const prevKey =
			ctx.orientation === 'horizontal' ? (rtl ? 'ArrowRight' : 'ArrowLeft') : 'ArrowUp';
		const nextKey =
			ctx.orientation === 'horizontal' ? (rtl ? 'ArrowLeft' : 'ArrowRight') : 'ArrowDown';
		if (event.key === prevKey) {
			event.preventDefault();
			ctx.moveFocus(id, -1);
		} else if (event.key === nextKey) {
			event.preventDefault();
			ctx.moveFocus(id, 1);
		}
	}

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			type,
			class: className,
			style,
			disabled: nativeDisabled || undefined,
			'aria-disabled': useAriaDisabled ? true : undefined,
			tabindex: isFocusable ? ctx.getTabIndex(id) : -1,
			'data-disabled': disabled ? '' : undefined,
			'data-orientation': ctx.orientation,
			onfocus: () => {
				if (isFocusable) ctx.setActiveId(id);
			},
			onkeydown: onToolbarKeyDown,
			onclick: (event: MouseEvent) => {
				if (disabled) {
					event.preventDefault();
					event.stopPropagation();
				}
			},
		}),
	);
</script>

<button
	{...mergedProps}
	{@attach (element) =>
		ctx.registerItem({
			id,
			element,
			kind: 'button',
			disabled,
			focusableWhenDisabled,
		})}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
>
	{#if children}
		{@render children({ disabled })}
	{/if}
</button>
