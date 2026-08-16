<script lang="ts">
	import { getContext } from 'svelte';
	import { COLLAPSIBLE_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { CollapsibleContext, CollapsiblePanelProps } from './types.js';

	let {
		keepMounted = false,
		role,
		class: className,
		style,
		children,
		...rest
	}: CollapsiblePanelProps = $props();

	const ctx = getContext<CollapsibleContext>(COLLAPSIBLE_CONTEXT);

	let panelHeight = $state<string | undefined>(undefined);
	let panelWidth = $state<string | undefined>(undefined);

	const shouldRender = $derived(keepMounted || ctx.presence.isPresent);

	function attachPanel(element: HTMLElement) {
		ctx.presence.setNode(element);

		const sync = () => {
			// Freeze dimensions while collapsing so height transitions stay stable.
			if (ctx.presence.isEnding) return;
			panelHeight = `${element.scrollHeight}px`;
			panelWidth = `${element.scrollWidth}px`;
		};
		sync();
		const observer = new ResizeObserver(sync);
		observer.observe(element);

		return () => {
			observer.disconnect();
			ctx.presence.setNode(null);
		};
	}

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id: ctx.panelId,
			role,
			class: className,
			style: [
				panelHeight ? `--collapsible-panel-height:${panelHeight}` : undefined,
				panelWidth ? `--collapsible-panel-width:${panelWidth}` : undefined,
				typeof style === 'string' ? style : undefined,
			]
				.filter(Boolean)
				.join(';'),
			hidden: keepMounted && !ctx.presence.isPresent ? true : undefined,
			'data-open': ctx.open ? '' : undefined,
			'data-closed': !ctx.open ? '' : undefined,
			'data-starting-style': ctx.presence.isStarting ? '' : undefined,
			'data-ending-style': ctx.presence.isEnding ? '' : undefined,
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
