import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const accordionVariants = tv({
	slots: {
		root: 'accordion',
		item: 'accordion-item',
		header: 'accordion-header',
		trigger: 'accordion-trigger',
		panel: 'accordion-panel',
		content: 'accordion-content',
	},
});

export type AccordionVariants = VariantProps<typeof accordionVariants>;
