<script lang="ts">
	import { getContext, hasContext } from 'svelte';
	import { DRAWER_CONTEXT, DRAWER_VIRTUAL_KEYBOARD_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type {
		DrawerContext,
		DrawerViewportProps,
		DrawerVirtualKeyboardContext,
	} from './types.js';

	let {
		render = 'div',
		class: className,
		style,
		children,
		...rest
	}: DrawerViewportProps = $props();

	const ctx = getContext<DrawerContext>(DRAWER_CONTEXT);
	const vk = hasContext(DRAWER_VIRTUAL_KEYBOARD_CONTEXT)
		? getContext<DrawerVirtualKeyboardContext>(DRAWER_VIRTUAL_KEYBOARD_CONTEXT)
		: undefined;

	const viewportStyle = $derived(
		[
			vk ? `--drawer-keyboard-inset:${vk.keyboardInset}px` : undefined,
			typeof style === 'string' ? style : undefined,
		]
			.filter(Boolean)
			.join(';'),
	);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style: viewportStyle || undefined,
			'data-open': ctx.open ? '' : undefined,
			'data-closed': !ctx.open || ctx.presence.isEnding ? '' : undefined,
			'data-starting-style': ctx.presence.isStarting ? '' : undefined,
			'data-ending-style': ctx.presence.isEnding ? '' : undefined,
			'data-swipe-direction': ctx.swipeDirection,
			'data-keyboard-open': vk?.keyboardOpen ? '' : undefined,
		}),
	);
</script>

{#if ctx.presence.isPresent}
	<svelte:element
		this={render}
		{...mergedProps}
		style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
	>
		{#if children}
			{@render children()}
		{/if}
	</svelte:element>
{/if}
