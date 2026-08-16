import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const buttonVariants = tv({
	base: 'btn',
	variants: {
		size: {
			sm: 'btn-sm',
			md: 'btn-md',
			lg: 'btn-lg'
		},
		variant: {
			primary: 'btn-primary',
			secondary: 'btn-secondary',
			ghost: 'btn-ghost',
			outline: 'btn-outline',
			danger: 'btn-danger'
		},
		icon: {
			true: 'btn-icon',
			false: ''
		}
	},
	defaultVariants: {
		size: 'md',
		variant: 'primary',
		icon: false
	}
});

export type ButtonVariants = VariantProps<typeof buttonVariants>;
