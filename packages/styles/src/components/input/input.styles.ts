import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const inputVariants = tv({
	base: 'input',
	variants: {
		size: {
			sm: 'input-sm',
			md: 'input-md',
			lg: 'input-lg',
		},
	},
	defaultVariants: {
		size: 'md',
	},
});

export type InputVariants = VariantProps<typeof inputVariants>;
