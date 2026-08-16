import type { Snippet } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';

export type InputProps = Omit<
	HTMLInputAttributes,
	'children' | 'disabled' | 'value' | 'defaultValue'
> & {
	disabled?: boolean;
	value?: string | undefined;
	defaultValue?: string;
	onValueChange?: ((value: string, event: Event) => void) | undefined;
	children?: Snippet;
};
