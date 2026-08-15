import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLImgAttributes } from 'svelte/elements';

export type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

export type AvatarContext = {
	readonly imageLoadingStatus: ImageLoadingStatus;
	setImageLoadingStatus(status: ImageLoadingStatus): void;
};

export type AvatarRootProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	children?: Snippet;
};

export type AvatarImageProps = Omit<HTMLImgAttributes, 'children'> & {
	onLoadingStatusChange?: ((status: ImageLoadingStatus) => void) | undefined;
};

export type AvatarFallbackProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	delay?: number;
	children?: Snippet;
};
