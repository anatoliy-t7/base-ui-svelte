import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLInputAttributes, HTMLLabelAttributes } from 'svelte/elements';

export type FieldValidationMode = 'onSubmit' | 'onBlur' | 'onChange';

/** Mirrors `ValidityState` flags plus nullable `valid` before first validation. */
export type FieldValidityFlags = {
	badInput: boolean;
	customError: boolean;
	patternMismatch: boolean;
	rangeOverflow: boolean;
	rangeUnderflow: boolean;
	stepMismatch: boolean;
	tooLong: boolean;
	tooShort: boolean;
	typeMismatch: boolean;
	valueMissing: boolean;
	valid: boolean | null;
};

export type FieldTransitionStatus = 'starting' | 'ending' | 'idle' | undefined;

/** Base UI `Field.Validity` state shape. */
export type FieldValidityState = {
	readonly validity: FieldValidityFlags;
	readonly transitionStatus: FieldTransitionStatus;
	readonly errors: string[];
	readonly value: unknown;
	readonly error: string;
	readonly initialValue: unknown;
};

export type FieldErrorMatch = boolean | keyof ValidityState;

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
	readonly initialValue: unknown;
	readonly touched: boolean;
	readonly dirty: boolean;
	readonly focused: boolean;
	readonly filled: boolean;
	readonly valid: boolean | null;
	readonly errors: string[];
	readonly validity: FieldValidityFlags;
	readonly validationMode: FieldValidationMode;
	setValue: (value: string, event?: Event) => void;
	setTouched: (touched: boolean) => void;
	setFocused: (focused: boolean) => void;
	setDirty: (dirty: boolean) => void;
	registerControl: (element: HTMLInputElement | null) => void;
	syncNativeValidity: (element: HTMLInputElement) => void;
	setCustomValidity: (message: string) => void;
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
			},
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
	/**
	 * When `true`, always show. When a `ValidityState` key, show when that flag is true.
	 * When omitted, show when the field is invalid (or has a form error).
	 */
	match?: FieldErrorMatch | undefined;
	children?: Snippet<[{ error: string }]>;
};

export type FieldItemProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	disabled?: boolean;
	children?: Snippet;
};

export type FieldValidityProps = {
	children: Snippet<[FieldValidityState]>;
};

export const DEFAULT_VALIDITY_FLAGS: FieldValidityFlags = {
	badInput: false,
	customError: false,
	patternMismatch: false,
	rangeOverflow: false,
	rangeUnderflow: false,
	stepMismatch: false,
	tooLong: false,
	tooShort: false,
	typeMismatch: false,
	valueMissing: false,
	valid: null,
};
