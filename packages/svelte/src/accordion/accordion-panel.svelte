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
	let panelWidth = $state<string | undefined>(undefined);

	const shouldRender = $derived(keepMounted || item.presence.isPresent);

	function attachPanel(element: HTMLElement) {
		item.presence.setNode(element);

		const sync = () => {
			// Freeze dimensions while collapsing so height transitions stay stable.
			if (item.presence.isEnding) return;
			panelHeight = `${element.scrollHeight}px`;
			panelWidth = `${element.scrollWidth}px`;
		};
		sync();
		const observer = new ResizeObserver(sync);
		observer.observe(element);

		return () => {
			observer.disconnect();
			item.presence.setNode(null);
		};
	}

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id: item.panelId,
			role: role ?? 'region',
			class: className,
			style: [
				panelHeight ? `--accordion-panel-height:${panelHeight}` : undefined,
				panelWidth ? `--accordion-panel-width:${panelWidth}` : undefined,
				panelHeight ? `--collapsible-panel-height:${panelHeight}` : undefined,
				panelWidth ? `--collapsible-panel-width:${panelWidth}` : undefined,
				typeof style === 'string' ? style : undefined,
			]
				.filter(Boolean)
				.join(';'),
			hidden: keepMounted && !item.presence.isPresent ? true : undefined,
			'aria-labelledby': item.triggerId,
			'data-open': item.open ? '' : undefined,
			'data-closed': !item.open ? '' : undefined,
			'data-starting-style': item.presence.isStarting ? '' : undefined,
			'data-ending-style': item.presence.isEnding ? '' : undefined,
		}),
	);
</script>

{#if shouldRender}
	<div
		{...mergedProps}
		style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
		{@attach attachPanel}
	>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
