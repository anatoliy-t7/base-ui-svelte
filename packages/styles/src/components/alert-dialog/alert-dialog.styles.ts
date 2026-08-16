import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const alertDialogVariants = tv({
  slots: {
    backdrop: "alert-dialog-backdrop",
    popup: "alert-dialog-popup",
    title: "alert-dialog-title",
    description: "alert-dialog-description",
    footer: "alert-dialog-footer",
  },
});

export type AlertDialogVariants = VariantProps<typeof alertDialogVariants>;
