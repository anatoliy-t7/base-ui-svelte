import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const drawerVariants = tv({
  slots: {
    backdrop: "drawer-backdrop",
    viewport: "drawer-viewport",
    popup: "drawer-popup",
    title: "drawer-title",
    description: "drawer-description",
    close: "drawer-close",
  },
  variants: {
    side: {
      "right": {
        popup: "drawer-popup-right",
      },
      "left": {
        popup: "drawer-popup-left",
      },
      "bottom": {
        popup: "drawer-popup-bottom",
      },
      "top": {
        popup: "drawer-popup-top",
      },
    },
  },
  defaultVariants: {
    side: "right",
  },
});

export type DrawerVariants = VariantProps<typeof drawerVariants>;
