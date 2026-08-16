import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const navigationMenuVariants = tv({
	slots: {
		root: 'navigation-menu',
		list: 'navigation-menu-list',
		item: 'navigation-menu-item',
		trigger: 'navigation-menu-trigger',
		content: 'navigation-menu-content',
		popup: 'navigation-menu-popup',
		viewport: 'navigation-menu-viewport',
		link: 'navigation-menu-link',
		indicator: 'navigation-menu-indicator',
	},
});

export type NavigationMenuVariants = VariantProps<typeof navigationMenuVariants>;
