import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const fieldVariants = tv({
	slots: {
		root: 'field',
		label: 'field-label',
		description: 'field-description',
		error: 'field-error',
		control: 'field-control',
		validity: 'field-validity',
	},
});

export type FieldVariants = VariantProps<typeof fieldVariants>;
