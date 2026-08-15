import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLFieldsetAttributes } from 'svelte/elements';

export type FieldsetContext = {
	readonly disabled: boolean;
};

export type FieldsetRootProps = Omit<HTMLFieldsetAttributes, 'children' | 'disabled'> & {
	disabled?: boolean;
	children?: Snippet<[{ disabled: boolean }]>;
};

export type FieldsetLegendProps = Omit<HTMLAttributes<HTMLLegendElement>, 'children'> & {
	children?: Snippet;
};
