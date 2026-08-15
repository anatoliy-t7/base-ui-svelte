import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import ToggleGroupTest from './toggle-group.test.svelte';

describe('ToggleGroup', () => {
	it('selects one value at a time and allows deselect', async () => {
		const user = userEvent.setup();
		render(ToggleGroupTest);

		const group = screen.getByTestId('toggle-group');
		const a = screen.getByTestId('toggle-a');
		const b = screen.getByTestId('toggle-b');

		expect(group).toHaveAttribute('role', 'group');
		expect(a).toHaveAttribute('aria-pressed', 'false');

		await user.click(a);
		expect(a).toHaveAttribute('aria-pressed', 'true');
		expect(b).toHaveAttribute('aria-pressed', 'false');

		await user.click(b);
		expect(a).toHaveAttribute('aria-pressed', 'false');
		expect(b).toHaveAttribute('aria-pressed', 'true');

		await user.click(b);
		expect(b).toHaveAttribute('aria-pressed', 'false');
	});

	it('has no axe violations', async () => {
		const { container } = render(ToggleGroupTest);
		expect(await axe(container)).toHaveNoViolations();
	});
});
