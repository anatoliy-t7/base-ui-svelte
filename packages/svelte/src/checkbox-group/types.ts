import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export type CheckboxGroupProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	value?: string[] | undefined;
	defaultValue?: string[];
	onValueChange?: ((value: string[], event: Event) => void) | undefined;
	disabled?: boolean;
	allValues?: string[] | undefined;
	children?: Snippet<[{ value: string[]; disabled: boolean }]>;
};

export type CheckboxGroupContext = {
	readonly value: string[];
	readonly disabled: boolean;
	isChecked(val: string): boolean;
	toggle(val: string, event: Event): void;
};
