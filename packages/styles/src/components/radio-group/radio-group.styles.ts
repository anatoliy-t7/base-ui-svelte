import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const radioGroupVariants = tv({
	slots: {
		root: 'radio-group',
		label: 'radio-group-label',
	},
});

export type RadioGroupVariants = VariantProps<typeof radioGroupVariants>;
