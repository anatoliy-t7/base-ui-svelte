import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const toggleGroupVariants = tv({
	slots: {
		root: 'toggle-group',
	},
});

export type ToggleGroupVariants = VariantProps<typeof toggleGroupVariants>;
