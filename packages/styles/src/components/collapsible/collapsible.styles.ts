import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const collapsibleVariants = tv({
	slots: {
		root: 'collapsible',
		trigger: 'collapsible-trigger',
		panel: 'collapsible-panel',
		content: 'collapsible-content',
	},
});

export type CollapsibleVariants = VariantProps<typeof collapsibleVariants>;
