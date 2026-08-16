import type { Snippet } from 'svelte';
import type { HTMLFormAttributes } from 'svelte/elements';

export type FormErrors = Record<string, string | string[]>;

export type FormFieldRegistration = {
	validate: () => Promise<boolean>;
};

export type FormContext = {
	readonly errors: FormErrors;
	getFieldError: (name: string) => string | undefined;
	clearFieldError: (name: string) => void;
	registerField: (name: string, registration: FormFieldRegistration) => void;
	unregisterField: (name: string) => void;
};

export type FormProps = Omit<HTMLFormAttributes, 'children' | 'onsubmit'> & {
	errors?: FormErrors | undefined;
	onFormSubmit?: ((formData: FormData, event: SubmitEvent) => void) | undefined;
	children?: Snippet;
};
