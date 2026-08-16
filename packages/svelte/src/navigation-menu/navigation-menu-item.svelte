<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import { useId } from '../internal/controllable.svelte.js';
	import {
		NAVIGATION_MENU_CONTEXT,
		NAVIGATION_MENU_ITEM_CONTEXT,
	} from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type {
		NavigationMenuContext,
		NavigationMenuItemContext,
		NavigationMenuItemProps,
	} from './types.js';

	let { value, class: className, style, id, children, ...rest }: NavigationMenuItemProps = $props();

	const root = getContext<NavigationMenuContext>(NAVIGATION_MENU_CONTEXT);

	const open = $derived(root.value === value);
	const triggerId = useId('navigation-menu-trigger');
	const contentId = useId('navigation-menu-content');

	setContext(NAVIGATION_MENU_ITEM_CONTEXT, {
		get value() {
			return value;
		},
		get open() {
			return open;
		},
		get triggerId() {
			return triggerId;
		},
		get contentId() {
			return contentId;
		},
	} satisfies NavigationMenuItemContext);

	const itemProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			role: 'none',
			class: className,
			style,
			'data-open': open ? '' : undefined,
			'data-closed': !open ? '' : undefined,
		}),
	);
</script>

<li {...itemProps} style={typeof itemProps.style === 'string' ? itemProps.style : undefined}>
	{#if children}
		{@render children({ open })}
	{/if}
</li>
