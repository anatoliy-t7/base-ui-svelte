import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import CheckboxTest from './checkbox.test.svelte';

describe('Checkbox', () => {
	it('toggles checked state on click and space', async () => {
		const user = userEvent.setup();
		render(CheckboxTest);

		const checkbox = screen.getByTestId('checkbox');
		expect(checkbox).toHaveAttribute('aria-checked', 'false');

		await user.click(checkbox);
		expect(checkbox).toHaveAttribute('aria-checked', 'true');
		expect(checkbox).toHaveAttribute('data-checked');

		await user.keyboard(' ');
		expect(checkbox).toHaveAttribute('aria-checked', 'false');
	});

	it('exposes indeterminate as aria-checked mixed', () => {
		render(CheckboxTest, { indeterminate: true });
		expect(screen.getByTestId('checkbox')).toHaveAttribute('aria-checked', 'mixed');
		expect(screen.getByTestId('checkbox')).toHaveAttribute('data-indeterminate');
	});

	it('does not toggle when readOnly', async () => {
		const user = userEvent.setup();
		render(CheckboxTest, { readOnly: true });

		const checkbox = screen.getByTestId('checkbox');
		await user.click(checkbox);
		expect(checkbox).toHaveAttribute('aria-checked', 'false');
	});

	it('has no axe violations', async () => {
		const { container } = render(CheckboxTest);
		expect(await axe(container)).toHaveNoViolations();
	});
});
