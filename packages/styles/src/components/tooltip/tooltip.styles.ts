import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const tooltipVariants = tv({
  slots: {
    popup: "tooltip-popup",
    arrow: "tooltip-arrow",
  },
});

export type TooltipVariants = VariantProps<typeof tooltipVariants>;
