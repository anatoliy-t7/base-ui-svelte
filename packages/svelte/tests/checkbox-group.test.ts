import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import CheckboxGroupTest from './checkbox-group.test.svelte';

describe('CheckboxGroup', () => {
	it('toggles multiple values independently', async () => {
		const user = userEvent.setup();
		render(CheckboxGroupTest);

		const group = screen.getByTestId('checkbox-group');
		const a = screen.getByTestId('checkbox-a');
		const b = screen.getByTestId('checkbox-b');

		expect(group).toHaveAttribute('role', 'group');
		expect(a).toHaveAttribute('aria-checked', 'false');

		await user.click(a);
		expect(a).toHaveAttribute('aria-checked', 'true');
		expect(b).toHaveAttribute('aria-checked', 'false');

		await user.click(b);
		expect(a).toHaveAttribute('aria-checked', 'true');
		expect(b).toHaveAttribute('aria-checked', 'true');

		await user.click(a);
		expect(a).toHaveAttribute('aria-checked', 'false');
		expect(b).toHaveAttribute('aria-checked', 'true');
	});

	it('has no axe violations', async () => {
		const { container } = render(CheckboxGroupTest);
		expect(await axe(container)).toHaveNoViolations();
	});
});
