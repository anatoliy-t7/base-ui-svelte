<script lang="ts">
	import { setContext } from 'svelte';
	import { AVATAR_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { AvatarContext, AvatarRootProps, ImageLoadingStatus } from './types.js';

	let { class: className, style, children, ...rest }: AvatarRootProps = $props();

	let imageLoadingStatus = $state<ImageLoadingStatus>('idle');

	function setImageLoadingStatus(status: ImageLoadingStatus): void {
		imageLoadingStatus = status;
	}

	setContext(AVATAR_CONTEXT, {
		get imageLoadingStatus() {
			return imageLoadingStatus;
		},
		setImageLoadingStatus,
	} satisfies AvatarContext);

	const rootProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style,
		}),
	);
</script>

<span {...rootProps}>
	{#if children}
		{@render children()}
	{/if}
</span>
