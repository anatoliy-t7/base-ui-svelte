import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';

export type RadioRootProps = Omit<HTMLButtonAttributes, 'children' | 'disabled' | 'value'> & {
	value: string;
	disabled?: boolean;
	children?: Snippet<[{ checked: boolean; disabled: boolean }]>;
};

export type RadioIndicatorProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	children?: Snippet;
};

export type RadioContext = {
	readonly checked: boolean;
	readonly disabled: boolean;
};
