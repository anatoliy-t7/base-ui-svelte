<script lang="ts">
	import { getContext } from 'svelte';
	import { ALERT_DIALOG_CONTEXT } from '../internal/context-keys.js';
	import { portal } from '../internal/portal.js';
	import type { AlertDialogContext, AlertDialogPortalProps } from './types.js';

	let { children }: AlertDialogPortalProps = $props();

	const ctx = getContext<AlertDialogContext>(ALERT_DIALOG_CONTEXT);
</script>

{#if ctx.presence.isPresent}
	<div {@attach portal()}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
