<script lang="ts">
	import { getContext } from 'svelte';
	import { MENU_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { MenuBackdropProps, MenuContext } from './types.js';

	let {
		render = 'div',
		dismissible = true,
		class: className,
		style,
		children,
		...rest
	}: MenuBackdropProps = $props();

	const ctx = getContext<MenuContext>(MENU_CONTEXT);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style: ['position:fixed;inset:0;', typeof style === 'string' ? style : undefined]
				.filter(Boolean)
				.join(';'),
			'data-open': ctx.open ? '' : undefined,
			'data-closed': !ctx.open ? '' : undefined,
			onclick: () => {
				if (!dismissible) return;
				ctx.setOpen(false, 'outside-press');
			}
		})
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
