import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import SelectMultipleTest from './select-multiple.test.svelte';

describe('Select multiple', () => {
	it('selects multiple items without closing', async () => {
		const user = userEvent.setup();
		render(SelectMultipleTest);

		await user.click(screen.getByTestId('trigger'));
		expect(screen.getByTestId('popup')).toBeInTheDocument();

		await user.click(screen.getByTestId('item-apple'));
		expect(screen.getByTestId('popup')).toBeInTheDocument();
		expect(screen.getByTestId('item-apple')).toHaveAttribute('aria-selected', 'true');
		expect(screen.getByTestId('value')).toHaveTextContent('Apple');

		await user.click(screen.getByTestId('item-banana'));
		expect(screen.getByTestId('popup')).toBeInTheDocument();
		expect(screen.getByTestId('item-banana')).toHaveAttribute('aria-selected', 'true');
		expect(screen.getByTestId('value')).toHaveTextContent('Apple, Banana');
	});
});
