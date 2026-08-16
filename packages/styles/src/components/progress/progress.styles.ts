import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const progressVariants = tv({
  slots: {
    root: "progress",
    label: "progress-label",
    value: "progress-value",
    track: "progress-track",
    indicator: "progress-indicator",
  },
});

export type ProgressVariants = VariantProps<typeof progressVariants>;
