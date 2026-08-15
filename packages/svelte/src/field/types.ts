import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLInputAttributes, HTMLLabelAttributes } from 'svelte/elements';

export type FieldValidationMode = 'onSubmit' | 'onBlur' | 'onChange';

export type FieldValidityState = {
	readonly valid: boolean | null;
	readonly errors: string[];
	readonly error: string | undefined;
	readonly value: string;
	readonly touched: boolean;
	readonly dirty: boolean;
	readonly filled: boolean;
	readonly focused: boolean;
};

export type FieldItemContext = {
	readonly disabled: boolean;
};

export type FieldContext = {
	readonly name: string | undefined;
	readonly controlId: string;
	readonly labelId: string;
	readonly descriptionId: string;
	readonly errorId: string;
	readonly disabled: boolean;
	readonly value: string;
	readonly touched: boolean;
	readonly dirty: boolean;
	readonly focused: boolean;
	readonly filled: boolean;
	readonly valid: boolean | null;
	readonly errors: string[];
	readonly validationMode: FieldValidationMode;
	setValue: (value: string, event?: Event) => void;
	setTouched: (touched: boolean) => void;
	setFocused: (focused: boolean) => void;
	setDirty: (dirty: boolean) => void;
	validate: () => Promise<boolean>;
	getDescribedBy: () => string | undefined;
	setHasDescription: (next: boolean) => void;
};

export type FieldRootProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	name?: string | undefined;
	disabled?: boolean;
	invalid?: boolean | undefined;
	validate?:
		| ((value: string) => string | string[] | null | Promise<string | string[] | null>)
		| undefined;
	validationMode?: FieldValidationMode;
	children?: Snippet<
		[
			{
				disabled: boolean;
				touched: boolean;
				dirty: boolean;
				focused: boolean;
				filled: boolean;
				valid: boolean | null;
			}
		]
	>;
};

export type FieldLabelProps = Omit<HTMLLabelAttributes, 'children'> & {
	children?: Snippet;
};

export type FieldControlProps = Omit<
	HTMLInputAttributes,
	'children' | 'disabled' | 'value' | 'name'
> & {
	disabled?: boolean | undefined;
	value?: string | undefined;
	defaultValue?: string;
	onValueChange?: ((value: string, event: Event) => void) | undefined;
	children?: Snippet;
};

export type FieldDescriptionProps = Omit<HTMLAttributes<HTMLParagraphElement>, 'children'> & {
	children?: Snippet;
};

export type FieldErrorProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'match'> & {
	/** `true` forces the error to show; otherwise shows when invalid and touched (or form error). */
	match?: boolean | string | undefined;
	children?: Snippet<[{ error: string | undefined }]>;
};

export type FieldItemProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	disabled?: boolean;
	children?: Snippet;
};

export type FieldValidityProps = {
	children: Snippet<[FieldValidityState]>;
};
