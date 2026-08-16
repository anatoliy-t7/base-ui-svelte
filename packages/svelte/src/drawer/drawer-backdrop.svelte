<script lang="ts">
	import { getContext } from 'svelte';
	import { DRAWER_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { DrawerBackdropProps, DrawerContext } from './types.js';

	let {
		render = 'div',
		class: className,
		style,
		children,
		...rest
	}: DrawerBackdropProps = $props();

	const ctx = getContext<DrawerContext>(DRAWER_CONTEXT);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style: [
				'position:fixed;inset:0;',
				typeof style === 'string' ? style : undefined
			]
				.filter(Boolean)
				.join(';'),
			'data-open': ctx.open ? '' : undefined,
			'data-closed': !ctx.open || ctx.presence.isEnding ? '' : undefined,
			'data-starting-style': ctx.presence.isStarting ? '' : undefined,
			'data-ending-style': ctx.presence.isEnding ? '' : undefined,
			onclick: () => {
				if (ctx.disablePointerDismissal) return;
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
