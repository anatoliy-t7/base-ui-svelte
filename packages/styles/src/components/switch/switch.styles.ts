import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const switchVariants = tv({
  slots: {
    root: "switch",
    thumb: "switch-thumb",
    label: "switch-label",
  },
});

export type SwitchVariants = VariantProps<typeof switchVariants>;
