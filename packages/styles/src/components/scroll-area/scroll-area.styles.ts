import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const scrollAreaVariants = tv({
  slots: {
    root: "scroll-area",
    viewport: "scroll-area-viewport",
    content: "scroll-area-content",
    scrollbar: "scroll-area-scrollbar",
    thumb: "scroll-area-thumb",
    corner: "scroll-area-corner",
  },
});

export type ScrollAreaVariants = VariantProps<typeof scrollAreaVariants>;
