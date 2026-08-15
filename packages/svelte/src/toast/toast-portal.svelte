<script lang="ts">
	import { portal } from '../internal/portal.js';
	import type { ToastPortalProps } from './types.js';

	let { children }: ToastPortalProps = $props();
</script>

<div {@attach portal()}>
	{#if children}
		{@render children()}
	{/if}
</div>
