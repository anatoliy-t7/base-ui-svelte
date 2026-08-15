<script lang="ts">
	import { getContext } from 'svelte';
	import {
		NAVIGATION_MENU_CONTEXT,
		NAVIGATION_MENU_ITEM_CONTEXT
	} from '../internal/context-keys.js';
	import type {
		NavigationMenuContext,
		NavigationMenuContentProps,
		NavigationMenuItemContext
	} from './types.js';

	let { children }: NavigationMenuContentProps = $props();

	const root = getContext<NavigationMenuContext>(NAVIGATION_MENU_CONTEXT);
	const item = getContext<NavigationMenuItemContext>(NAVIGATION_MENU_ITEM_CONTEXT);
</script>

{#if children}
	<span
		hidden
		aria-hidden="true"
		{@attach () => root.registerContent(item.value, children)}
	></span>
{/if}
