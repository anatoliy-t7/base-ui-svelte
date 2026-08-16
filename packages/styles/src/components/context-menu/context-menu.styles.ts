import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const contextMenuVariants = tv({
	slots: {
		popup: 'context-menu-popup',
		item: 'context-menu-item',
		separator: 'context-menu-separator',
		surface: 'context-surface',
	},
});

export type ContextMenuVariants = VariantProps<typeof contextMenuVariants>;
