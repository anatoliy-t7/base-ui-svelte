import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const dialogVariants = tv({
  slots: {
    backdrop: "dialog-backdrop",
    popup: "dialog-popup",
    title: "dialog-title",
    description: "dialog-description",
    close: "dialog-close",
    footer: "dialog-footer",
  },
  variants: {
    size: {
      "sm": {
        popup: "dialog-popup-sm",
      },
      "md": {
        popup: "dialog-popup-md",
      },
      "lg": {
        popup: "dialog-popup-lg",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export type DialogVariants = VariantProps<typeof dialogVariants>;
