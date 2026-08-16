import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export type CheckboxGroupProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	value?: string[] | undefined;
	defaultValue?: string[];
	onValueChange?: ((value: string[], event: Event) => void) | undefined;
	disabled?: boolean;
	/** Values controlled by a parent checkbox (`parent` on Checkbox.Root). */
	allValues?: string[] | undefined;
	children?: Snippet<[{ value: string[]; disabled: boolean }]>;
};

export type CheckboxGroupContext = {
	readonly value: string[];
	readonly disabled: boolean;
	readonly allValues: string[] | undefined;
	isChecked(val: string): boolean;
	toggle(val: string, event: Event): void;
	setAll(checked: boolean, event: Event): void;
};
