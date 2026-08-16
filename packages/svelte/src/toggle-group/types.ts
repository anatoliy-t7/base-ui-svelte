import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export type ToggleGroupOrientation = 'horizontal' | 'vertical';

export type ToggleGroupProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	value?: string[] | undefined;
	defaultValue?: string[];
	onValueChange?: ((value: string[], event: Event) => void) | undefined;
	multiple?: boolean;
	disabled?: boolean;
	orientation?: ToggleGroupOrientation;
	children?: Snippet<[{ value: string[]; disabled: boolean }]>;
};

export type ToggleGroupContext = {
	readonly value: string[];
	readonly disabled: boolean;
	readonly multiple: boolean;
	setValue(next: string[], event: Event): void;
	toggleValue(itemValue: string, event: Event): void;
};
