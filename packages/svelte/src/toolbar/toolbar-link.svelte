<script lang="ts">
	import { getContext, hasContext } from 'svelte';
	import { useId } from '../internal/controllable.svelte.js';
	import { DIRECTION_CONTEXT, TOOLBAR_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { DirectionContext } from '../direction-provider/types.js';
	import type { ToolbarContext, ToolbarLinkProps } from './types.js';

	let {
		class: className,
		style,
		id: idProp,
		children,
		...rest
	}: ToolbarLinkProps = $props();

	const fallbackId = useId('toolbar-link');
	const id = $derived(idProp ?? fallbackId);

	const ctx = getContext<ToolbarContext>(TOOLBAR_CONTEXT);
	const directionContext = hasContext(DIRECTION_CONTEXT)
		? getContext<DirectionContext>(DIRECTION_CONTEXT)
		: undefined;

	function onToolbarKeyDown(event: KeyboardEvent): void {
		const direction = directionContext?.direction ?? 'ltr';
		const rtl = direction === 'rtl' && ctx.orientation === 'horizontal';
		const prevKey =
			ctx.orientation === 'horizontal'
				? rtl
					? 'ArrowRight'
					: 'ArrowLeft'
				: 'ArrowUp';
		const nextKey =
			ctx.orientation === 'horizontal'
				? rtl
					? 'ArrowLeft'
					: 'ArrowRight'
				: 'ArrowDown';
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
			class: className,
			style,
			tabindex: ctx.getTabIndex(id),
			'data-orientation': ctx.orientation,
			onfocus: () => {
				ctx.setActiveId(id);
			},
			onkeydown: onToolbarKeyDown
		})
	);
</script>

<a
	{...mergedProps}
	{@attach (element) =>
		ctx.registerItem({
			id,
			element,
			kind: 'link',
			disabled: false,
			focusableWhenDisabled: true
		})}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
>
	{#if children}
		{@render children()}
	{/if}
</a>
