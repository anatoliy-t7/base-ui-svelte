import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
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

	it('navigates and selects with keyboard', async () => {
		const user = userEvent.setup();
		render(SelectTest);

		const trigger = screen.getByTestId('trigger');
		trigger.focus();
		await user.keyboard('{ArrowDown}');
		await waitFor(() => {
			expect(screen.getByTestId('popup')).toBeInTheDocument();
		});

		await user.keyboard('{ArrowDown}');
		await waitFor(() => {
			expect(screen.getByTestId('item-apple')).toHaveAttribute('data-highlighted');
		});

		await user.keyboard('{ArrowDown}');
		expect(screen.getByTestId('item-banana')).toHaveAttribute('data-highlighted');

		await user.keyboard('{End}');
		expect(screen.getByTestId('item-cherry')).toHaveAttribute('data-highlighted');

		await user.keyboard('{Home}');
		expect(screen.getByTestId('item-apple')).toHaveAttribute('data-highlighted');

		await user.keyboard('{Enter}');
		await waitFor(() => {
			expect(screen.queryByTestId('popup')).toBeNull();
		});
		expect(screen.getByTestId('value')).toHaveTextContent('Apple');
	});

	it('closes on Escape', async () => {
		const user = userEvent.setup();
		render(SelectTest);

		await user.click(screen.getByTestId('trigger'));
		expect(screen.getByTestId('popup')).toBeInTheDocument();

		await user.keyboard('{Escape}');
		await waitFor(() => {
			expect(screen.queryByTestId('popup')).toBeNull();
		});
	});

	it('respects defaultValue and defaultOpen', () => {
		render(SelectTest, { props: { defaultValue: 'banana', defaultOpen: true } });

		expect(screen.getByTestId('value')).toHaveTextContent('Banana');
		expect(screen.getByTestId('popup')).toBeInTheDocument();
		expect(screen.getByTestId('item-banana')).toHaveAttribute('aria-selected', 'true');
	});

	it('does not open when disabled', async () => {
		const user = userEvent.setup();
		render(SelectTest, { props: { disabled: true } });

		const trigger = screen.getByTestId('trigger');
		expect(trigger).toBeDisabled();
		await user.click(trigger);
		expect(screen.queryByTestId('popup')).toBeNull();
	});

	it('notifies onValueChange when an item is selected', async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(SelectTest, { props: { onValueChange } });

		await user.click(screen.getByTestId('trigger'));
		await user.click(screen.getByTestId('item-apple'));

		expect(onValueChange).toHaveBeenCalledWith('apple', expect.any(Event));
	});

	it('has no axe violations when open', async () => {
		const user = userEvent.setup();
		const { container } = render(SelectTest);
		await user.click(screen.getByTestId('trigger'));
		expect(await axe(container)).toHaveNoViolations();
	});

	it('submits the selected value while the popup is closed', async () => {
		const user = userEvent.setup();
		render(SelectTest, { props: { name: 'fruit', defaultValue: 'apple' } });

		expect(screen.queryByTestId('popup')).toBeNull();
		const form = screen.getByTestId('form') as HTMLFormElement;
		expect(new FormData(form).get('fruit')).toBe('apple');

		await user.click(screen.getByTestId('trigger'));
		await user.click(screen.getByTestId('item-banana'));
		await waitFor(() => {
			expect(screen.queryByTestId('popup')).toBeNull();
		});
		expect(new FormData(form).get('fruit')).toBe('banana');
	});
});
