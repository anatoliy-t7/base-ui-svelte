import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const sliderVariants = tv({
  slots: {
    root: "slider",
    label: "slider-label",
    value: "slider-value",
    control: "slider-control",
    track: "slider-track",
    indicator: "slider-indicator",
    thumb: "slider-thumb",
  },
});

export type SliderVariants = VariantProps<typeof sliderVariants>;
