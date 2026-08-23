<script lang="ts">
	import { getContext } from 'svelte';
	import { COMBOBOX_CONTEXT } from '../internal/context-keys.js';
	import { portal } from '../internal/portal.js';
	import type { ComboboxContext, ComboboxPortalProps } from './types.js';

	let { container, keepMounted = false, children }: ComboboxPortalProps = $props();

	const ctx = getContext<ComboboxContext>(COMBOBOX_CONTEXT);

	const shouldRender = $derived(keepMounted || ctx.presence.isPresent);
</script>

{#if shouldRender}
	<div
		{@attach portal(container)}
		hidden={keepMounted && !ctx.presence.isPresent ? true : undefined}
	>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
