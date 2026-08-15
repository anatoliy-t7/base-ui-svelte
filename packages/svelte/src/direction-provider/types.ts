import type { Snippet } from 'svelte';

export type TextDirection = 'ltr' | 'rtl';

export type DirectionContext = {
	readonly direction: TextDirection;
};

export type DirectionProviderProps = {
	direction?: TextDirection;
	children?: Snippet;
};
