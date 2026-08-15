<script lang="ts">
	import { getContext } from 'svelte';
	import { AVATAR_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { AvatarContext, AvatarFallbackProps } from './types.js';

	let {
		delay = 0,
		class: className,
		style,
		children,
		...rest
	}: AvatarFallbackProps = $props();

	const ctx = getContext<AvatarContext>(AVATAR_CONTEXT);

	let delayElapsed = $state(false);

	$effect(() => {
		if (delay <= 0) {
			delayElapsed = true;
			return;
		}

		delayElapsed = false;
		const timeoutId = window.setTimeout(() => {
			delayElapsed = true;
		}, delay);

		return () => {
			window.clearTimeout(timeoutId);
		};
	});

	const canShow = $derived(
		delayElapsed &&
			(ctx.imageLoadingStatus === 'idle' || ctx.imageLoadingStatus === 'error')
	);

	const fallbackProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style
		})
	);
</script>

{#if canShow}
	<span {...fallbackProps}>
		{#if children}
			{@render children()}
		{/if}
	</span>
{/if}
