import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import ToggleTest from './toggle.test.svelte';

describe('Toggle', () => {
	it('toggles pressed state on click', async () => {
		const user = userEvent.setup();
		render(ToggleTest);

		const toggle = screen.getByTestId('toggle');
		expect(toggle).toHaveAttribute('aria-pressed', 'false');

		await user.click(toggle);
		expect(toggle).toHaveAttribute('aria-pressed', 'true');
		expect(toggle).toHaveAttribute('data-pressed');

		await user.click(toggle);
		expect(toggle).toHaveAttribute('aria-pressed', 'false');
	});

	it('has no axe violations', async () => {
		const { container } = render(ToggleTest);
		expect(await axe(container)).toHaveNoViolations();
	});
});
