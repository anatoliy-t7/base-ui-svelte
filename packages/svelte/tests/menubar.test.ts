import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import MenubarTest from './menubar.test.svelte';

describe('Menubar', () => {
	it('moves highlight one item at a time with ArrowDown', async () => {
		const user = userEvent.setup();
		render(MenubarTest);

		await user.click(screen.getByTestId('file-trigger'));
		const first = screen.getByTestId('file-item-new');
		const second = screen.getByTestId('file-item-open');
		const third = screen.getByTestId('file-item-save');

		await waitFor(() => {
			expect(first).toHaveFocus();
		});

		await user.keyboard('{ArrowDown}');
		expect(second).toHaveFocus();

		await user.keyboard('{ArrowDown}');
		expect(third).toHaveFocus();
	});

	it('opens menus and moves between triggers with arrows', async () => {
		const user = userEvent.setup();
		render(MenubarTest);

		const menubar = screen.getByTestId('menubar');
		expect(menubar).toHaveAttribute('role', 'menubar');

		const fileTrigger = screen.getByTestId('file-trigger');
		const editTrigger = screen.getByTestId('edit-trigger');

		await user.click(fileTrigger);
		expect(screen.getByTestId('file-popup')).toBeInTheDocument();
		expect(fileTrigger).toHaveAttribute('aria-expanded', 'true');

		fileTrigger.focus();
		await user.keyboard('{ArrowRight}');

		await waitFor(() => {
			expect(screen.queryByTestId('file-popup')).toBeNull();
			expect(screen.getByTestId('edit-popup')).toBeInTheDocument();
		});
		expect(editTrigger).toHaveAttribute('aria-expanded', 'true');

		editTrigger.focus();
		await user.keyboard('{ArrowLeft}');

		await waitFor(() => {
			expect(screen.getByTestId('file-popup')).toBeInTheDocument();
			expect(screen.queryByTestId('edit-popup')).toBeNull();
		});
		expect(fileTrigger).toHaveAttribute('aria-expanded', 'true');
	});

	it('has no axe violations when a menu is open', async () => {
		const user = userEvent.setup();
		const { container } = render(MenubarTest);
		await user.click(screen.getByTestId('file-trigger'));
		expect(await axe(container)).toHaveNoViolations();
	});
});
