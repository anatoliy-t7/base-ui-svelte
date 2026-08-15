<script lang="ts">
	import { getContext } from 'svelte';
	import { ACCORDION_ITEM_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { AccordionItemContext, AccordionPanelProps } from './types.js';

	let {
		keepMounted = false,
		role,
		class: className,
		style,
		children,
		...rest
	}: AccordionPanelProps = $props();

	const item = getContext<AccordionItemContext>(ACCORDION_ITEM_CONTEXT);

	let panelHeight = $state<string | undefined>(undefined);

	const shouldRender = $derived(keepMounted || item.presence.isPresent);

	function measurePanel(element: HTMLElement) {
		const sync = () => {
			panelHeight = `${element.scrollHeight}px`;
		};
		sync();
		const observer = new ResizeObserver(sync);
		observer.observe(element);
		return () => {
			observer.disconnect();
		};
	}

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id: item.panelId,
			role,
			class: className,
			style: [
				panelHeight ? `--collapsible-panel-height:${panelHeight}` : undefined,
				typeof style === 'string' ? style : undefined
			]
				.filter(Boolean)
				.join(';'),
			hidden: keepMounted && !item.open ? true : undefined,
			'data-open': item.open ? '' : undefined,
			'data-closed': !item.open ? '' : undefined
		})
	);
</script>

{#if shouldRender}
	<div
		{...mergedProps}
		style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
		{@attach measurePanel}
	>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
