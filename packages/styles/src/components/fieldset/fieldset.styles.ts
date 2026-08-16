import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const fieldsetVariants = tv({
	slots: {
		root: 'fieldset',
		legend: 'fieldset-legend',
	},
});

export type FieldsetVariants = VariantProps<typeof fieldsetVariants>;
