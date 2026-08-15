import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import AutocompleteTest from './autocomplete.test.svelte';

describe('Autocomplete', () => {
	it('filters items by typing and selects an item', async () => {
		const user = userEvent.setup();
		render(AutocompleteTest);

		const input = screen.getByTestId('input');
		expect(input).toHaveAttribute('role', 'combobox');
		expect(input).toHaveAttribute('aria-autocomplete', 'list');
		expect(input).toHaveAttribute('aria-expanded', 'false');
		expect(screen.getByTestId('label')).toHaveTextContent('Fruit');
		expect(screen.getByTestId('clear')).toHaveAttribute('data-hidden');

		await user.click(input);
		expect(screen.getByTestId('popup')).toBeInTheDocument();
		expect(screen.getByTestId('list')).toHaveAttribute('role', 'listbox');
		expect(screen.getByTestId('group')).toHaveAttribute('role', 'group');
		expect(screen.getByTestId('group-label')).toHaveTextContent('Citrus');
		expect(input).toHaveAttribute('aria-expanded', 'true');
		expect(screen.getByTestId('item-apple')).toBeVisible();
		expect(screen.getByTestId('item-banana')).toBeVisible();

		await user.type(input, 'ban');
		await waitFor(() => {
			expect(screen.getByTestId('item-banana')).toBeVisible();
			expect(screen.getByTestId('item-apple')).not.toBeVisible();
			expect(screen.getByTestId('item-cherry')).not.toBeVisible();
		});

		await user.click(screen.getByTestId('item-banana'));
		await waitFor(() => {
			expect(screen.queryByTestId('popup')).toBeNull();
		});
		expect(input).toHaveValue('Banana');
	});

	it('clears value and input via Clear', async () => {
		const user = userEvent.setup();
		render(AutocompleteTest);

		const input = screen.getByTestId('input');
		await user.click(input);
		await user.type(input, 'ban');
		await user.click(screen.getByTestId('item-banana'));
		expect(input).toHaveValue('Banana');

		await user.click(screen.getByTestId('clear'));
		expect(input).toHaveValue('');
		expect(screen.getByTestId('clear')).toHaveAttribute('data-hidden');

		await user.click(input);
		await user.type(input, 'ap');
		await waitFor(() => {
			expect(screen.getByTestId('item-apple')).toBeVisible();
			expect(screen.getByTestId('item-banana')).not.toBeVisible();
		});
	});

	it('has no axe violations when open', async () => {
		const user = userEvent.setup();
		const { container } = render(AutocompleteTest);
		await user.click(screen.getByTestId('input'));
		expect(await axe(container)).toHaveNoViolations();
	});
});
