import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import AlertDialogTest from './alert-dialog.test.svelte';

describe('AlertDialog', () => {
	it('opens and closes with trigger, escape, and close button', async () => {
		const user = userEvent.setup();
		render(AlertDialogTest);

		expect(screen.queryByTestId('popup')).toBeNull();
		expect(screen.getByTestId('trigger')).toHaveAttribute('aria-expanded', 'false');

		await user.click(screen.getByTestId('trigger'));
		expect(screen.getByTestId('popup')).toBeInTheDocument();
		expect(screen.getByTestId('popup')).toHaveAttribute('role', 'alertdialog');
		expect(screen.getByTestId('popup')).toHaveAttribute('aria-modal', 'true');
		expect(screen.getByTestId('trigger')).toHaveAttribute('aria-expanded', 'true');

		await user.keyboard('{Escape}');
		await waitFor(() => {
			expect(screen.queryByTestId('popup')).toBeNull();
		});

		await user.click(screen.getByTestId('trigger'));
		await user.click(screen.getByTestId('close'));
		await waitFor(() => {
			expect(screen.queryByTestId('popup')).toBeNull();
		});
	});

	it('does not close when backdrop is clicked', async () => {
		const user = userEvent.setup();
		render(AlertDialogTest);

		await user.click(screen.getByTestId('trigger'));
		expect(screen.getByTestId('popup')).toBeInTheDocument();

		await user.click(screen.getByTestId('backdrop'));
		expect(screen.getByTestId('popup')).toBeInTheDocument();
	});

	it('has no axe violations when open', async () => {
		const user = userEvent.setup();
		const { container } = render(AlertDialogTest);
		await user.click(screen.getByTestId('trigger'));
		expect(await axe(container)).toHaveNoViolations();
	});
});
