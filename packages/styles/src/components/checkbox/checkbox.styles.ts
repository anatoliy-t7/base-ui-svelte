import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const checkboxVariants = tv({
	slots: {
		root: 'checkbox',
		indicator: 'checkbox-indicator',
		label: 'checkbox-label',
	},
	variants: {
		size: {
			sm: { root: 'checkbox-sm' },
			md: { root: '' },
			lg: { root: 'checkbox-lg' },
		},
	},
	defaultVariants: {
		size: 'md',
	},
});

export type CheckboxVariants = VariantProps<typeof checkboxVariants>;
