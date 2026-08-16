import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const menubarVariants = tv({
  slots: {
    root: "menubar",
    trigger: "menubar-trigger",
    popup: "menubar-popup",
    item: "menubar-item",
  },
});

export type MenubarVariants = VariantProps<typeof menubarVariants>;
