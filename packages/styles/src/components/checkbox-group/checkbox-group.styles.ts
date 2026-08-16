import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const checkboxGroupVariants = tv({
  slots: {
    root: "checkbox-group",
    label: "checkbox-group-label",
  },
});

export type CheckboxGroupVariants = VariantProps<typeof checkboxGroupVariants>;
