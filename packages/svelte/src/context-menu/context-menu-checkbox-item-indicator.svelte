<script lang="ts">
	import { getContext } from 'svelte';
	import { CONTEXT_MENU_CHECKBOX_ITEM_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type {
		ContextMenuCheckboxItemContext,
		ContextMenuCheckboxItemIndicatorProps,
	} from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: ContextMenuCheckboxItemIndicatorProps = $props();

	const ctx = getContext<ContextMenuCheckboxItemContext>(CONTEXT_MENU_CHECKBOX_ITEM_CONTEXT);

	const visible = $derived(ctx.checked);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style,
			hidden: !visible ? true : undefined,
			'data-checked': ctx.checked ? '' : undefined,
			'data-unchecked': !ctx.checked ? '' : undefined,
			'data-disabled': ctx.disabled ? '' : undefined,
		}),
	);
</script>

{#if visible}
	<span
		{...mergedProps}
		style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
	>
		{#if children}
			{@render children()}
		{:else}
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
				<path d="M3.5 8.5l3 3 6-6" stroke="currentColor" stroke-width="2" fill="none" />
			</svg>
		{/if}
	</span>
{/if}
