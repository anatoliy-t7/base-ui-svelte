<script lang="ts">
	import { getContext } from 'svelte';
	import { SELECT_ITEM_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { SelectItemContext, SelectItemTextProps } from './types.js';

	let { class: className, style, children, ...rest }: SelectItemTextProps = $props();

	const item = getContext<SelectItemContext>(SELECT_ITEM_CONTEXT);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style,
			'data-select-item-text': '',
			'data-selected': item.selected ? '' : undefined,
			'data-highlighted': item.highlighted ? '' : undefined,
		}),
	);
</script>

<span
	{...mergedProps}
	{@attach (element) => {
		const sync = () => {
			const label = element.textContent?.trim() ?? '';
			if (label) item.setLabel(label);
		};
		sync();
		const observer = new MutationObserver(sync);
		observer.observe(element, { characterData: true, childList: true, subtree: true });
		return () => observer.disconnect();
	}}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
>
	{#if children}
		{@render children()}
	{/if}
</span>
