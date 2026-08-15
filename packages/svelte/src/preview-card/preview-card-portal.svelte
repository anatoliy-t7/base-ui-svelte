<script lang="ts">
	import { getContext } from 'svelte';
	import { PREVIEW_CARD_CONTEXT } from '../internal/context-keys.js';
	import { portal } from '../internal/portal.js';
	import type { PreviewCardContext, PreviewCardPortalProps } from './types.js';

	let { children }: PreviewCardPortalProps = $props();

	const ctx = getContext<PreviewCardContext>(PREVIEW_CARD_CONTEXT);
</script>

{#if ctx.presence.isPresent}
	<div {@attach portal()}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
