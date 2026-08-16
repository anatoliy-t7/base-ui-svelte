<script lang="ts">
	import { getContext } from 'svelte';
	import { DIALOG_CONTEXT } from '../internal/context-keys.js';
	import { portal } from '../internal/portal.js';
	import type { DialogContext, DialogPortalProps } from './types.js';

	let { container, keepMounted = false, children }: DialogPortalProps = $props();

	const ctx = getContext<DialogContext>(DIALOG_CONTEXT);

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
