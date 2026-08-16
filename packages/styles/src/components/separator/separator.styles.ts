import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const separatorVariants = tv({
	slots: {
		root: 'sep',
		row: 'sep-row',
	},
});

export type SeparatorVariants = VariantProps<typeof separatorVariants>;
