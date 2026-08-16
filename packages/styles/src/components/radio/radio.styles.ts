import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const radioVariants = tv({
	slots: {
		root: 'radio',
		indicator: 'radio-indicator',
		label: 'radio-label',
	},
	variants: {
		size: {
			sm: { root: 'radio-sm' },
			md: { root: '' },
			lg: { root: 'radio-lg' },
		},
	},
	defaultVariants: {
		size: 'md',
	},
});

export type RadioVariants = VariantProps<typeof radioVariants>;
