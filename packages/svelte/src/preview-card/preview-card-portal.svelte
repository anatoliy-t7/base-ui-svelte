<script lang="ts">
	import { getContext } from 'svelte';
	import { PREVIEW_CARD_CONTEXT } from '../internal/context-keys.js';
	import { portal } from '../internal/portal.js';
	import type { PreviewCardContext, PreviewCardPortalProps } from './types.js';

	let { container, keepMounted = false, children }: PreviewCardPortalProps = $props();

	const ctx = getContext<PreviewCardContext>(PREVIEW_CARD_CONTEXT);

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
