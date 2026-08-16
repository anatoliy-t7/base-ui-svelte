import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const comboboxVariants = tv({
	slots: {
		inputGroup: 'combobox-input-group',
		input: 'combobox-input',
		trigger: 'combobox-trigger',
		icon: 'combobox-icon',
		popup: 'combobox-popup',
		item: 'combobox-item',
		empty: 'combobox-empty',
		groupLabel: 'combobox-group-label'
	}
});

export type ComboboxVariants = VariantProps<typeof comboboxVariants>;
