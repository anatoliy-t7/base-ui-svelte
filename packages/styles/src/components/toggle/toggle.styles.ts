import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const toggleVariants = tv({
	base: 'toggle',
	variants: {
		size: {
			sm: 'toggle-sm',
			md: '',
			lg: 'toggle-lg',
		},
	},
	defaultVariants: {
		size: 'md',
	},
});

export type ToggleVariants = VariantProps<typeof toggleVariants>;
