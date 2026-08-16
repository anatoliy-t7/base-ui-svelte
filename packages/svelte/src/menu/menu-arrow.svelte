<script lang="ts">
	import { getContext } from 'svelte';
	import { MENU_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { MenuArrowProps, MenuContext } from './types.js';

	let { class: className, style, children, ...rest }: MenuArrowProps = $props();

	const ctx = getContext<MenuContext>(MENU_CONTEXT);

	let arrowEl = $state<HTMLElement | null>(null);

	$effect(() => {
		ctx.refs.arrow = arrowEl;
		return () => {
			if (ctx.refs.arrow === arrowEl) {
				ctx.refs.arrow = null;
			}
		};
	});

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style,
			'aria-hidden': 'true',
			'data-open': ctx.open ? '' : undefined,
			'data-closed': !ctx.open ? '' : undefined,
		}),
	);
</script>

<span
	{...mergedProps}
	bind:this={arrowEl}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
>
	{#if children}
		{@render children()}
	{/if}
</span>
