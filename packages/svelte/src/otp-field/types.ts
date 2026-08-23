import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLInputAttributes } from 'svelte/elements';

export type OtpFieldContext = {
	readonly value: string;
	readonly slots: string[];
	readonly length: number;
	readonly disabled: boolean;
	readonly readOnly: boolean;
	readonly type: 'text' | 'password';
	readonly mask: boolean | string | undefined;
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
	autoSubmit?: boolean;
	/** When true, inputs use `type="password"`. A string sets a display mask character via CSS hooks. */
	mask?: boolean | string;
	/** Built-in character validation. Overrides default digit-only when set. */
	validationType?: 'numeric' | 'alphanumeric' | 'none';
	normalizeValue?: ((value: string) => string) | undefined;
	onValueInvalid?: ((details: { value: string; reason: 'pattern' | 'validation-type' }) => void) | undefined;
	readOnly?: boolean;
	required?: boolean;
	form?: string | undefined;
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
	orientation?: 'horizontal' | 'vertical';
	children?: Snippet;
};
