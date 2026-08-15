<script lang="ts">
	import { getContext } from 'svelte';
	import { SELECT_ITEM_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { SelectItemContext, SelectItemIndicatorProps } from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: SelectItemIndicatorProps = $props();

	const item = getContext<SelectItemContext>(SELECT_ITEM_CONTEXT);

	const visible = $derived(item.selected);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style,
			hidden: !visible ? true : undefined,
			'data-selected': item.selected ? '' : undefined,
			'data-disabled': item.disabled ? '' : undefined
		})
	);
</script>

{#if visible}
	<span {...mergedProps} style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}>
		{#if children}
			{@render children()}
		{:else}
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
				<path
					d="M3.5 8.5L6.5 11.5L12.5 4.5"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		{/if}
	</span>
{/if}
