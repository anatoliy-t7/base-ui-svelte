import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const meterVariants = tv({
	slots: {
		root: 'meter',
		label: 'meter-label',
		value: 'meter-value',
		track: 'meter-track',
		indicator: 'meter-indicator',
	},
});

export type MeterVariants = VariantProps<typeof meterVariants>;
