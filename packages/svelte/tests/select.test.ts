import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import SelectTest from './select.test.svelte';

describe('Select', () => {
	it('opens on trigger and selects an item', async () => {
		const user = userEvent.setup();
		render(SelectTest);

		const trigger = screen.getByTestId('trigger');
		expect(trigger).toHaveAttribute('role', 'combobox');
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
		expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
		expect(screen.getByTestId('label')).toHaveTextContent('Fruit');
		expect(screen.getByTestId('value')).toHaveTextContent('Pick a fruit');

		await user.click(trigger);
		expect(screen.getByTestId('popup')).toBeInTheDocument();
		expect(screen.getByTestId('list')).toHaveAttribute('role', 'listbox');
		expect(screen.getByTestId('group')).toHaveAttribute('role', 'group');
		expect(screen.getByTestId('group-label')).toHaveTextContent('Citrus');
		expect(screen.getByTestId('separator')).toHaveAttribute('role', 'separator');
		expect(trigger).toHaveAttribute('aria-expanded', 'true');

		const apple = screen.getByTestId('item-apple');
		expect(apple).toHaveAttribute('role', 'option');
		expect(apple).toHaveAttribute('aria-selected', 'false');

		await user.click(apple);
		await waitFor(() => {
			expect(screen.queryByTestId('popup')).toBeNull();
		});
		expect(screen.getByTestId('value')).toHaveTextContent('Apple');

		await user.click(trigger);
		expect(screen.getByTestId('item-apple')).toHaveAttribute('aria-selected', 'true');
		expect(screen.getByTestId('item-apple')).toHaveAttribute('data-selected');
		expect(screen.getByTestId('indicator-apple')).toBeInTheDocument();
	});

	it('has no axe violations when open', async () => {
		const user = userEvent.setup();
		const { container } = render(SelectTest);
		await user.click(screen.getByTestId('trigger'));
		expect(await axe(container)).toHaveNoViolations();
	});
});
