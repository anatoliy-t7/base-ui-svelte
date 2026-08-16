import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { afterEach, describe, expect, it, vi } from 'vitest';
import TooltipTest from './tooltip.test.svelte';

describe('Tooltip', () => {
	afterEach(() => {
		vi.useRealTimers();
	});

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

	it('respects openDelay before opening', async () => {
		vi.useFakeTimers({ shouldAdvanceTime: true });
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		render(TooltipTest, { props: { openDelay: 600, closeDelay: 0 } });

		await user.hover(screen.getByTestId('trigger'));
		expect(screen.queryByTestId('popup')).toBeNull();

		await vi.advanceTimersByTimeAsync(599);
		expect(screen.queryByTestId('popup')).toBeNull();

		await vi.advanceTimersByTimeAsync(1);
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
