<script lang="ts">
	import { getContext } from 'svelte';
	import { AVATAR_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { AvatarContext, AvatarImageProps, ImageLoadingStatus } from './types.js';

	let {
		src,
		alt = '',
		class: className,
		style,
		onLoadingStatusChange,
		onload,
		onerror,
		...rest
	}: AvatarImageProps = $props();

	const ctx = getContext<AvatarContext>(AVATAR_CONTEXT);

	function updateStatus(status: ImageLoadingStatus): void {
		ctx.setImageLoadingStatus(status);
		onLoadingStatusChange?.(status);
	}

	$effect(() => {
		if (!src) {
			updateStatus('error');
			return;
		}
		updateStatus('loading');
	});

	const loaded = $derived(ctx.imageLoadingStatus === 'loaded');

	const imageProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			src,
			alt,
			class: className,
			style,
			hidden: loaded ? undefined : true,
			onload: (event: Event) => {
				updateStatus('loaded');
				if (typeof onload === 'function') {
					(onload as (e: Event) => void)(event);
				}
			},
			onerror: (event: Event) => {
				updateStatus('error');
				if (typeof onerror === 'function') {
					(onerror as (e: Event) => void)(event);
				}
			}
		})
	);
</script>

{#if src}
	<img {...imageProps} />
{/if}
