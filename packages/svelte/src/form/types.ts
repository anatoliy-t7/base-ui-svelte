import type { Snippet } from 'svelte';
import type { HTMLFormAttributes } from 'svelte/elements';

export type FormErrors = Record<string, string | string[]>;

export type FormContext = {
	readonly errors: FormErrors;
	getFieldError: (name: string) => string | undefined;
	clearFieldError: (name: string) => void;
};

export type FormRootProps = Omit<HTMLFormAttributes, 'children' | 'onsubmit'> & {
	errors?: FormErrors | undefined;
	onFormSubmit?: ((formData: FormData, event: SubmitEvent) => void) | undefined;
	children?: Snippet;
};
