import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export type ButtonProps = Omit<
	HTMLAttributes<HTMLElement>,
	'children' | 'disabled' | 'type'
> & {
	disabled?: boolean;
	focusableWhenDisabled?: boolean;
	/** HTML element tag to render. Defaults to `button`. */
	render?: string;
	/** Defaults to `button`. Set `submit` explicitly for form submit buttons. */
	type?: 'button' | 'submit' | 'reset' | undefined;
	children?: Snippet<[{ disabled: boolean }]>;
};
