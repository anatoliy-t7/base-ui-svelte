import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';

export type CheckboxRootProps = Omit<
	HTMLButtonAttributes,
	'children' | 'disabled' | 'value' | 'form' | 'name' | 'required' | 'readOnly'
> & {
	checked?: boolean | undefined;
	defaultChecked?: boolean;
	onCheckedChange?: ((checked: boolean, event: Event) => void) | undefined;
	disabled?: boolean;
	required?: boolean;
	readOnly?: boolean;
	name?: string | undefined;
	value?: string | undefined;
	/** Submitted when the checkbox is unchecked (native form pattern). */
	uncheckedValue?: string | undefined;
	/** Form id association for the hidden input. */
	form?: string | undefined;
	indeterminate?: boolean;
	/**
	 * When true inside a CheckboxGroup with `allValues`, this checkbox controls
	 * selecting / clearing the whole group (parent checkbox).
	 */
	parent?: boolean;
	children?: Snippet<[{ checked: boolean; disabled: boolean; indeterminate: boolean }]>;
};

export type CheckboxIndicatorProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	keepMounted?: boolean;
	children?: Snippet;
};

export type CheckboxContext = {
	readonly checked: boolean;
	readonly disabled: boolean;
	readonly indeterminate: boolean;
};
