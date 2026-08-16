<script lang="ts">
	import { setContext } from 'svelte';
	import { CSP_CONTEXT } from '../internal/context-keys.js';
	import type { CspContext, CspProviderProps } from './types.js';

	let { nonce, children }: CspProviderProps = $props();

	setContext(CSP_CONTEXT, {
		get nonce() {
			return nonce;
		},
	} satisfies CspContext);
</script>

{#if children}
	{@render children()}
{/if}
