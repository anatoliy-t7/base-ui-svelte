import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLInputAttributes } from 'svelte/elements';

export type OtpFieldContext = {
	readonly value: string;
	readonly slots: string[];
	readonly length: number;
	readonly disabled: boolean;
	readonly type: 'text' | 'password';
	readonly pattern: string | undefined;
	readonly autoFocus: boolean;
	readonly name: string | undefined;
	registerInput(): number;
	setSlot(index: number, char: string, event: Event): void;
	clearSlot(index: number, event: Event): void;
	focusSlot(index: number): void;
	handlePaste(index: number, text: string, event: Event): void;
	registerElement(index: number, element: HTMLInputElement | null): void;
};

export type OtpFieldRootProps = Omit<
	HTMLAttributes<HTMLDivElement>,
	'children' | 'onValueChange'
> & {
	length?: number;
	value?: string | undefined;
	defaultValue?: string;
	onValueChange?: ((value: string, event: Event) => void) | undefined;
	onComplete?: ((value: string) => void) | undefined;
	disabled?: boolean;
	type?: 'text' | 'password';
	pattern?: string | undefined;
	autoFocus?: boolean;
	name?: string | undefined;
	children?: Snippet<[{ value: string; disabled: boolean }]>;
};

export type OtpFieldInputProps = Omit<
	HTMLInputAttributes,
	'children' | 'disabled' | 'type' | 'value' | 'maxLength'
> & {
	index?: number | undefined;
	disabled?: boolean;
};

export type OtpFieldSeparatorProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};
