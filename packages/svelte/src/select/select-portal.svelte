<script lang="ts">
	import { getContext } from 'svelte';
	import { SELECT_CONTEXT } from '../internal/context-keys.js';
	import { portal } from '../internal/portal.js';
	import type { SelectContext, SelectPortalProps } from './types.js';

	let { children }: SelectPortalProps = $props();

	const ctx = getContext<SelectContext>(SELECT_CONTEXT);
</script>

{#if ctx.presence.isPresent}
	<div {@attach portal()}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
