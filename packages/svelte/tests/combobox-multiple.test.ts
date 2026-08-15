import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import ComboboxMultipleTest from './combobox-multiple.test.svelte';

describe('Combobox multiple', () => {
	it('selects two items as chips and removes a chip', async () => {
		const user = userEvent.setup();
		render(ComboboxMultipleTest);

		const input = screen.getByTestId('input');
		await user.click(input);
		expect(screen.getByTestId('popup')).toBeInTheDocument();

		await user.click(screen.getByTestId('item-apple'));
		await user.click(screen.getByTestId('item-banana'));

		expect(screen.getByTestId('chip-apple')).toBeInTheDocument();
		expect(screen.getByTestId('chip-banana')).toBeInTheDocument();
		expect(screen.getByTestId('value')).toHaveTextContent('apple,banana');
		expect(screen.getByTestId('popup')).toBeInTheDocument();
		expect(input).toHaveValue('');

		await user.click(screen.getByTestId('remove-apple'));
		await waitFor(() => {
			expect(screen.queryByTestId('chip-apple')).toBeNull();
		});
		expect(screen.getByTestId('chip-banana')).toBeInTheDocument();
		expect(screen.getByTestId('value')).toHaveTextContent('banana');
	});
});
