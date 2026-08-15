import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import DrawerTest from './drawer.test.svelte';

describe('Drawer', () => {
	it('opens and closes with trigger, escape, and close button', async () => {
		const user = userEvent.setup();
		render(DrawerTest);

		expect(screen.queryByTestId('popup')).toBeNull();
		expect(screen.getByTestId('trigger')).toHaveAttribute('aria-expanded', 'false');
		expect(screen.getByTestId('indent')).toHaveAttribute('data-inactive');
		expect(screen.getByTestId('indent-background')).toHaveAttribute('data-inactive');
		expect(screen.getByTestId('swipe-area')).toBeInTheDocument();

		await user.click(screen.getByTestId('trigger'));
		expect(screen.getByTestId('popup')).toBeInTheDocument();
		expect(screen.getByTestId('popup')).toHaveAttribute('role', 'dialog');
		expect(screen.getByTestId('popup')).toHaveAttribute('aria-modal', 'true');
		expect(screen.getByTestId('trigger')).toHaveAttribute('aria-expanded', 'true');
		expect(screen.getByTestId('indent')).toHaveAttribute('data-active');
		expect(screen.getByTestId('indent-background')).toHaveAttribute('data-active');
		expect(screen.queryByTestId('swipe-area')).toBeNull();

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

	it('opens from swipe area when closed', async () => {
		const user = userEvent.setup();
		render(DrawerTest);
		await user.click(screen.getByTestId('swipe-area'));
		expect(screen.getByTestId('popup')).toBeInTheDocument();
	});

	it('has no axe violations when open', async () => {
		const user = userEvent.setup();
		const { container } = render(DrawerTest);
		await user.click(screen.getByTestId('trigger'));
		expect(await axe(container)).toHaveNoViolations();
	});
});
