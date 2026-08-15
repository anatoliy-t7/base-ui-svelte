import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import ContextMenuTest from './context-menu.test.svelte';

describe('ContextMenu', () => {
	it('opens on contextmenu', async () => {
		render(ContextMenuTest);

		expect(screen.queryByTestId('popup')).toBeNull();

		await fireEvent.contextMenu(screen.getByTestId('trigger'), {
			clientX: 40,
			clientY: 60
		});

		await waitFor(() => {
			expect(screen.getByTestId('popup')).toBeInTheDocument();
		});
		expect(screen.getByTestId('popup')).toHaveAttribute('role', 'menu');
	});

	it('renders arrow and checkbox item when open', async () => {
		render(ContextMenuTest);

		await fireEvent.contextMenu(screen.getByTestId('trigger'), {
			clientX: 40,
			clientY: 60
		});

		await waitFor(() => {
			expect(screen.getByTestId('popup')).toBeInTheDocument();
		});

		expect(screen.getByTestId('arrow')).toBeInTheDocument();
		expect(screen.getByTestId('checkbox-item')).toHaveAttribute('role', 'menuitemcheckbox');
		expect(screen.getByTestId('checkbox-item')).toHaveAttribute('aria-checked', 'true');
	});

	it('has no axe violations when open', async () => {
		const { container } = render(ContextMenuTest);
		await fireEvent.contextMenu(screen.getByTestId('trigger'), {
			clientX: 40,
			clientY: 60
		});
		await waitFor(() => {
			expect(screen.getByTestId('popup')).toBeInTheDocument();
		});
		expect(await axe(container)).toHaveNoViolations();
	});
});
