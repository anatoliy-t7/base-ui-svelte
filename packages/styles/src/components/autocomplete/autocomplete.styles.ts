import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const autocompleteVariants = tv({
	slots: {
		inputGroup: 'autocomplete-input-group',
		input: 'autocomplete-input',
		trigger: 'autocomplete-trigger',
		icon: 'autocomplete-icon',
		popup: 'autocomplete-popup',
		item: 'autocomplete-item',
		empty: 'autocomplete-empty'
	}
});

export type AutocompleteVariants = VariantProps<typeof autocompleteVariants>;
