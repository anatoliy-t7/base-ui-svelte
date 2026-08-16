import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const tabsVariants = tv({
	slots: {
		root: 'tabs',
		list: 'tabs-list',
		tab: 'tabs-tab',
		panel: 'tabs-panel',
		indicator: 'tabs-indicator',
	},
	variants: {
		variant: {
			primary: { root: '' },
			secondary: { root: 'tabs-secondary' },
		},
	},
	defaultVariants: {
		variant: 'primary',
	},
});

export type TabsVariants = VariantProps<typeof tabsVariants>;
