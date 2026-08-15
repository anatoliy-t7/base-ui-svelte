import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import ToastTest from './toast.test.svelte';

describe('Toast', () => {
	it('adds and closes toasts', async () => {
		const user = userEvent.setup();
		render(ToastTest);

		expect(screen.queryByTestId('toast')).not.toBeInTheDocument();

		await user.click(screen.getByTestId('trigger'));
		expect(screen.getByTestId('toast')).toHaveAttribute('role', 'status');
		expect(screen.getByTestId('toast')).toHaveAttribute('data-open');
		expect(screen.getByTestId('title')).toHaveTextContent('Saved');
		expect(screen.getByTestId('description')).toHaveTextContent('Your changes were saved.');
		expect(screen.getByTestId('action')).toHaveTextContent('Undo');
		expect(screen.getByTestId('viewport')).toHaveAttribute('role', 'region');
		expect(screen.getByTestId('viewport')).toHaveAttribute('aria-label', 'Notifications');

		await user.click(screen.getByTestId('close'));
		await waitFor(() => {
			expect(screen.queryByTestId('toast')).not.toBeInTheDocument();
		});
	});

	it('closes via action button', async () => {
		const user = userEvent.setup();
		render(ToastTest);

		await user.click(screen.getByTestId('trigger'));
		await user.click(screen.getByTestId('action'));
		await waitFor(() => {
			expect(screen.queryByTestId('toast')).not.toBeInTheDocument();
		});
	});

	it('has no axe violations with an open toast', async () => {
		const user = userEvent.setup();
		const { container } = render(ToastTest);
		await user.click(screen.getByTestId('trigger'));
		expect(await axe(container)).toHaveNoViolations();
	});
});
