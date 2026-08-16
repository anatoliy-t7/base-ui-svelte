import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const numberFieldVariants = tv({
  slots: {
    root: "number-field",
    group: "number-field-group",
    input: "number-field-input",
    increment: "number-field-increment",
    decrement: "number-field-decrement",
    scrubArea: "number-field-scrub-area",
  },
});

export type NumberFieldVariants = VariantProps<typeof numberFieldVariants>;
