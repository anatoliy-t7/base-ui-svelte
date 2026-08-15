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

	const shouldRender = $derived(keepMounted || ctx.presence.isPresent);

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
			id: ctx.panelId,
			role,
			class: className,
			style: [
				panelHeight ? `--collapsible-panel-height:${panelHeight}` : undefined,
				typeof style === 'string' ? style : undefined
			]
				.filter(Boolean)
				.join(';'),
			hidden: keepMounted && !ctx.open ? true : undefined,
			'data-open': ctx.open ? '' : undefined,
			'data-closed': !ctx.open ? '' : undefined
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
