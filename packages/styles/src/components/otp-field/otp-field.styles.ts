import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const otpFieldVariants = tv({
  slots: {
    root: "otp-field",
    input: "otp-field-input",
    separator: "otp-field-separator",
  },
});

export type OtpFieldVariants = VariantProps<typeof otpFieldVariants>;
