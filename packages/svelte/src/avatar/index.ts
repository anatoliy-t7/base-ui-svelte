import Root from './avatar-root.svelte';
import Image from './avatar-image.svelte';
import Fallback from './avatar-fallback.svelte';

export const Avatar = {
	Root,
	Image,
	Fallback,
};

export type {
	AvatarRootProps,
	AvatarImageProps,
	AvatarFallbackProps,
	AvatarContext,
	ImageLoadingStatus,
} from './types.js';
