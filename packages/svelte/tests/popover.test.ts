import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import PopoverTest from './popover.test.svelte';

describe('Popover', () => {
	it('opens on trigger and closes on escape', async () => {
		const user = userEvent.setup();
		render(PopoverTest);

		expect(screen.getByTestId('trigger')).toHaveAttribute('aria-expanded', 'false');

		await user.click(screen.getByTestId('trigger'));
		expect(screen.getByTestId('popup')).toBeInTheDocument();
		expect(screen.getByTestId('popup')).toHaveAttribute('role', 'dialog');
		expect(screen.getByTestId('backdrop')).toBeInTheDocument();
		expect(screen.getByTestId('viewport')).toBeInTheDocument();
		expect(screen.getByTestId('trigger')).toHaveAttribute('aria-expanded', 'true');

		await user.keyboard('{Escape}');
		await waitFor(() => {
			expect(screen.queryByTestId('popup')).toBeNull();
		});
	});

	it('closes on close button', async () => {
		const user = userEvent.setup();
		render(PopoverTest);

		await user.click(screen.getByTestId('trigger'));
		await user.click(screen.getByTestId('close'));
		await waitFor(() => {
			expect(screen.queryByTestId('popup')).toBeNull();
		});
	});

	it('has no axe violations when open', async () => {
		const user = userEvent.setup();
		const { container } = render(PopoverTest);
		await user.click(screen.getByTestId('trigger'));
		expect(await axe(container)).toHaveNoViolations();
	});
});
