<script lang="ts">
	import { getContext } from 'svelte';
	import { MENU_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { MenuContext, MenuViewportProps } from './types.js';

	let { class: className, style, children, ...rest }: MenuViewportProps = $props();

	getContext<MenuContext>(MENU_CONTEXT);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			role: 'presentation',
			class: className,
			style: ['overflow:auto;max-height:inherit;', typeof style === 'string' ? style : undefined]
				.filter(Boolean)
				.join(';'),
		}),
	);
</script>

<div {...mergedProps} style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}>
	{#if children}
		{@render children()}
	{/if}
</div>
