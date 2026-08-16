import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const previewCardVariants = tv({
  slots: {
    popup: "preview-card-popup",
    trigger: "preview-card-trigger",
  },
});

export type PreviewCardVariants = VariantProps<typeof previewCardVariants>;
