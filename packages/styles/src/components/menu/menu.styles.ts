import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const menuVariants = tv({
	slots: {
		popup: 'menu-popup',
		item: 'menu-item',
		indicator: 'menu-item-indicator',
		separator: 'menu-separator',
		groupLabel: 'menu-group-label',
		empty: 'menu-empty',
		submenuTrigger: 'menu-submenu-trigger',
	},
});

export type MenuVariants = VariantProps<typeof menuVariants>;
