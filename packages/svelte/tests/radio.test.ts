import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import RadioTest from './radio.test.svelte';

describe('Radio', () => {
	it('selects a radio on click and moves with arrow keys', async () => {
		const user = userEvent.setup();
		render(RadioTest);

		const group = screen.getByTestId('radio-group');
		const a = screen.getByTestId('radio-a');
		const b = screen.getByTestId('radio-b');

		expect(group).toHaveAttribute('role', 'radiogroup');
		expect(a).toHaveAttribute('aria-checked', 'false');

		await user.click(a);
		expect(a).toHaveAttribute('aria-checked', 'true');
		expect(a).toHaveAttribute('data-checked');
		expect(screen.getByTestId('indicator-a')).toBeInTheDocument();

		a.focus();
		await user.keyboard('{ArrowDown}');
		expect(b).toHaveAttribute('aria-checked', 'true');
		expect(a).toHaveAttribute('aria-checked', 'false');
		expect(b).toHaveFocus();
	});

	it('has no axe violations', async () => {
		const { container } = render(RadioTest);
		expect(await axe(container)).toHaveNoViolations();
	});
});
