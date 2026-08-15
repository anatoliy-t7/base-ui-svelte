import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import SwitchTest from './switch.test.svelte';

describe('Switch', () => {
	it('toggles on click', async () => {
		const user = userEvent.setup();
		render(SwitchTest);
		const el = screen.getByTestId('switch');
		expect(el).toHaveAttribute('aria-checked', 'false');
		await user.click(el);
		expect(el).toHaveAttribute('aria-checked', 'true');
		expect(el).toHaveAttribute('role', 'switch');
	});

	it('has no axe violations', async () => {
		const { container } = render(SwitchTest);
		expect(await axe(container)).toHaveNoViolations();
	});
});
