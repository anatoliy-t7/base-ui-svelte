<script lang="ts">
	import { getContext } from 'svelte';
	import { COMBOBOX_CONTEXT } from '../internal/context-keys.js';
	import { portal } from '../internal/portal.js';
	import type { ComboboxContext, ComboboxPortalProps } from './types.js';

	let { children }: ComboboxPortalProps = $props();

	const ctx = getContext<ComboboxContext>(COMBOBOX_CONTEXT);
</script>

{#if ctx.presence.isPresent}
	<div {@attach portal()}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
