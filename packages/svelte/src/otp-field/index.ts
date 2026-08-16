import Root from './otp-field-root.svelte';
import Input from './otp-field-input.svelte';
import Separator from './otp-field-separator.svelte';

export const OTPField = {
	Root,
	Input,
	Separator,
};

export type {
	OtpFieldRootProps,
	OtpFieldInputProps,
	OtpFieldSeparatorProps,
	OtpFieldContext,
} from './types.js';
