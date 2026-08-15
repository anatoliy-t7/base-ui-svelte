import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import TooltipTest from './tooltip.test.svelte';

describe('Tooltip', () => {
	it('shows on hover and hides on escape', async () => {
		const user = userEvent.setup();
		render(TooltipTest);

		await user.hover(screen.getByTestId('trigger'));
		await waitFor(() => {
			expect(screen.getByTestId('popup')).toBeInTheDocument();
		});
		expect(screen.getByTestId('popup')).toHaveAttribute('role', 'tooltip');
		expect(screen.getByTestId('trigger')).toHaveAttribute(
			'aria-describedby',
			screen.getByTestId('popup').id
		);

		await user.keyboard('{Escape}');
		await waitFor(() => {
			expect(screen.queryByTestId('popup')).toBeNull();
		});
	});

	it('shows on focus', async () => {
		const user = userEvent.setup();
		render(TooltipTest);

		await user.tab();
		expect(screen.getByTestId('trigger')).toHaveFocus();
		await waitFor(() => {
			expect(screen.getByTestId('popup')).toBeInTheDocument();
		});
	});

	it('has no axe violations when open', async () => {
		const user = userEvent.setup();
		const { container } = render(TooltipTest);
		await user.hover(screen.getByTestId('trigger'));
		await waitFor(() => {
			expect(screen.getByTestId('popup')).toBeInTheDocument();
		});
		expect(await axe(container)).toHaveNoViolations();
	});
});
