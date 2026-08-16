import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const formVariants = tv({
  slots: {
    root: "form",
  },
});

export type FormVariants = VariantProps<typeof formVariants>;
