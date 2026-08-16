<script lang="ts">
	import { setContext } from 'svelte';
	import { DIRECTION_CONTEXT } from '../internal/context-keys.js';
	import type { DirectionContext, DirectionProviderProps } from './types.js';

	let { direction = 'ltr', children }: DirectionProviderProps = $props();

	setContext(DIRECTION_CONTEXT, {
		get direction() {
			return direction;
		},
	} satisfies DirectionContext);
</script>

{#if children}
	{@render children()}
{/if}
