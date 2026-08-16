import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const toolbarVariants = tv({
  slots: {
    root: "toolbar",
    button: "toolbar-button",
    separator: "toolbar-separator",
    group: "toolbar-group",
  },
});

export type ToolbarVariants = VariantProps<typeof toolbarVariants>;
