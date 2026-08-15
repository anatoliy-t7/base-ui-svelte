import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import MenuTest from './menu.test.svelte';

describe('Menu', () => {
	it('opens and closes on trigger', async () => {
		const user = userEvent.setup();
		render(MenuTest);

		expect(screen.getByTestId('trigger')).toHaveAttribute('aria-expanded', 'false');
		expect(screen.getByTestId('trigger')).toHaveAttribute('aria-haspopup', 'menu');

		await user.click(screen.getByTestId('trigger'));
		expect(screen.getByTestId('popup')).toBeInTheDocument();
		expect(screen.getByTestId('popup')).toHaveAttribute('role', 'menu');
		expect(screen.getByTestId('trigger')).toHaveAttribute('aria-expanded', 'true');

		await user.keyboard('{Escape}');
		await waitFor(() => {
			expect(screen.queryByTestId('popup')).toBeNull();
		});
	});

	it('closes when an item is clicked', async () => {
		const user = userEvent.setup();
		render(MenuTest);

		await user.click(screen.getByTestId('trigger'));
		await user.click(screen.getByTestId('item-1'));
		await waitFor(() => {
			expect(screen.queryByTestId('popup')).toBeNull();
		});
	});

	it('toggles checkbox item without closing', async () => {
		const user = userEvent.setup();
		render(MenuTest);

		await user.click(screen.getByTestId('trigger'));
		const checkbox = screen.getByTestId('checkbox-item');
		expect(checkbox).toHaveAttribute('role', 'menuitemcheckbox');
		expect(checkbox).toHaveAttribute('aria-checked', 'false');

		await user.click(checkbox);
		expect(checkbox).toHaveAttribute('aria-checked', 'true');
		expect(checkbox).toHaveAttribute('data-checked', '');
		expect(screen.getByTestId('checkbox-indicator')).toBeInTheDocument();
		expect(screen.getByTestId('popup')).toBeInTheDocument();
	});

	it('opens submenu on hover and shows nested item', async () => {
		const user = userEvent.setup();
		render(MenuTest);

		await user.click(screen.getByTestId('trigger'));
		const submenuTrigger = screen.getByTestId('submenu-trigger');
		expect(submenuTrigger).toHaveAttribute('aria-haspopup', 'menu');
		expect(submenuTrigger).toHaveAttribute('aria-expanded', 'false');

		await user.hover(submenuTrigger);
		await waitFor(() => {
			expect(screen.getByTestId('submenu-popup')).toBeInTheDocument();
		});
		expect(submenuTrigger).toHaveAttribute('aria-expanded', 'true');
		expect(screen.getByTestId('submenu-item')).toBeInTheDocument();
	});

	it('renders arrow when open', async () => {
		const user = userEvent.setup();
		render(MenuTest);

		await user.click(screen.getByTestId('trigger'));
		expect(screen.getByTestId('arrow')).toBeInTheDocument();
		expect(screen.getByTestId('arrow')).toHaveAttribute('aria-hidden', 'true');
	});

	it('has no axe violations when open', async () => {
		const user = userEvent.setup();
		const { container } = render(MenuTest);
		await user.click(screen.getByTestId('trigger'));
		expect(await axe(container)).toHaveNoViolations();
	});
});
