import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export type RadioGroupProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	value?: string | undefined;
	defaultValue?: string;
	onValueChange?: ((value: string, event: Event) => void) | undefined;
	disabled?: boolean;
	name?: string | undefined;
	required?: boolean;
	children?: Snippet<[{ value: string; disabled: boolean }]>;
};

export type RadioEntry = {
	id: string;
	value: string;
	element: HTMLElement;
};

export type RadioGroupContext = {
	readonly value: string;
	readonly disabled: boolean;
	readonly name: string | undefined;
	readonly required: boolean;
	setValue(next: string, event: Event): void;
	registerRadio(id: string, value: string, element: HTMLElement): () => void;
	getRadios(): RadioEntry[];
};
