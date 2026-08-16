<script lang="ts">
	import { getContext } from 'svelte';
	import { TABS_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { TabsContext, TabsPanelProps } from './types.js';

	let { value, class: className, style, children, ...rest }: TabsPanelProps = $props();

	const ctx = getContext<TabsContext>(TABS_CONTEXT);

	const selected = $derived(ctx.value === value);
	const panelId = $derived(ctx.getPanelId(value));
	const tabId = $derived(ctx.getTabId(value));

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id: panelId,
			role: 'tabpanel',
			class: className,
			style,
			hidden: !selected ? true : undefined,
			tabindex: selected ? 0 : undefined,
			'aria-labelledby': tabId,
			'data-selected': selected ? '' : undefined,
			'data-orientation': ctx.orientation,
		}),
	);
</script>

<div {...mergedProps} style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}>
	{#if children}
		{@render children()}
	{/if}
</div>
