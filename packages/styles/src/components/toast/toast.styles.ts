import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const toastVariants = tv({
  slots: {
    viewport: "toast-viewport",
    root: "toast",
    title: "toast-title",
    description: "toast-description",
    close: "toast-close",
    action: "toast-action",
  },
});

export type ToastVariants = VariantProps<typeof toastVariants>;
