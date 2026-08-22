import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const buttonMotionVariants = tv({
	base: '',
	variants: {
		motion: {
			none: '',
			press: 'btn-motion-press',
			'press-plus': 'btn-motion-press btn-motion-press-plus',
		},
	},
	defaultVariants: {
		motion: 'none',
	},
});

export type ButtonMotionVariants = VariantProps<typeof buttonMotionVariants>;
