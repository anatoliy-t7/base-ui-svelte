import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import ToolbarTest from './toolbar.test.svelte';

describe('Toolbar', () => {
	it('renders toolbar with role and orientation', () => {
		render(ToolbarTest);
		const toolbar = screen.getByTestId('toolbar');
		expect(toolbar).toHaveAttribute('role', 'toolbar');
		expect(toolbar).toHaveAttribute('data-orientation', 'horizontal');
		expect(screen.getByTestId('separator')).toHaveAttribute('role', 'separator');
	});

	it('moves focus with arrow keys among controls', async () => {
		const user = userEvent.setup();
		render(ToolbarTest);

		const bold = screen.getByTestId('bold');
		const italic = screen.getByTestId('italic');

		bold.focus();
		expect(bold).toHaveFocus();

		await user.keyboard('{ArrowRight}');
		expect(italic).toHaveFocus();
	});

	it('has no axe violations', async () => {
		const { container } = render(ToolbarTest);
		expect(await axe(container)).toHaveNoViolations();
	});
});
