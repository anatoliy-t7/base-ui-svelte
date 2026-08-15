<script lang="ts">
	import { getContext } from 'svelte';
	import { DIALOG_CONTEXT } from '../internal/context-keys.js';
	import { portal } from '../internal/portal.js';
	import type { DialogContext, DialogPortalProps } from './types.js';

	let { children }: DialogPortalProps = $props();

	const ctx = getContext<DialogContext>(DIALOG_CONTEXT);
</script>

{#if ctx.presence.isPresent}
	<div {@attach portal()}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
