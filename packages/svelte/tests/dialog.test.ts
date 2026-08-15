import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import DialogTest from './dialog.test.svelte';

describe('Dialog', () => {
	it('opens and closes with trigger, escape, and close button', async () => {
		const user = userEvent.setup();
		render(DialogTest);

		expect(screen.queryByTestId('popup')).toBeNull();
		expect(screen.getByTestId('trigger')).toHaveAttribute('aria-expanded', 'false');

		await user.click(screen.getByTestId('trigger'));
		expect(screen.getByTestId('popup')).toBeInTheDocument();
		expect(screen.getByTestId('viewport')).toBeInTheDocument();
		expect(screen.getByTestId('popup')).toHaveAttribute('role', 'dialog');
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

	it('closes when backdrop is clicked', async () => {
		const user = userEvent.setup();
		render(DialogTest);

		await user.click(screen.getByTestId('trigger'));
		expect(screen.getByTestId('popup')).toBeInTheDocument();

		await user.click(screen.getByTestId('backdrop'));
		await waitFor(() => {
			expect(screen.queryByTestId('popup')).toBeNull();
		});
	});

	it('has no axe violations when open', async () => {
		const user = userEvent.setup();
		const { container } = render(DialogTest);
		await user.click(screen.getByTestId('trigger'));
		expect(await axe(container)).toHaveNoViolations();
	});
});
