import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const popoverVariants = tv({
	slots: {
		popup: 'popover-popup',
		arrow: 'popover-arrow',
		title: 'popover-title',
		description: 'popover-description',
		close: 'popover-close',
	},
});

export type PopoverVariants = VariantProps<typeof popoverVariants>;
