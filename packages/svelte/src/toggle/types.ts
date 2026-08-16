import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';

export type ToggleProps = Omit<HTMLButtonAttributes, 'children' | 'disabled' | 'value'> & {
	pressed?: boolean | undefined;
	defaultPressed?: boolean;
	onPressedChange?: ((pressed: boolean, event: Event) => void) | undefined;
	disabled?: boolean;
	value?: string | undefined;
	children?: Snippet<[{ pressed: boolean; disabled: boolean }]>;
};
