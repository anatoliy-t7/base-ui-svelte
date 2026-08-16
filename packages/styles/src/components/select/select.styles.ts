import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const selectVariants = tv({
  slots: {
    trigger: "select-trigger",
    value: "select-value",
    icon: "select-icon",
    popup: "select-popup",
    item: "select-item",
    itemIndicator: "select-item-indicator",
    groupLabel: "select-group-label",
    scrollUp: "select-scroll-up",
    scrollDown: "select-scroll-down",
  },
});

export type SelectVariants = VariantProps<typeof selectVariants>;
