import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';

export type CheckboxRootProps = Omit<HTMLButtonAttributes, 'children' | 'disabled' | 'value'> & {
	checked?: boolean | undefined;
	defaultChecked?: boolean;
	onCheckedChange?: ((checked: boolean, event: Event) => void) | undefined;
	disabled?: boolean;
	required?: boolean;
	name?: string | undefined;
	value?: string | undefined;
	children?: Snippet<[{ checked: boolean; disabled: boolean }]>;
};

export type CheckboxIndicatorProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	children?: Snippet;
};

export type CheckboxContext = {
	readonly checked: boolean;
	readonly disabled: boolean;
	readonly indeterminate: boolean;
};
