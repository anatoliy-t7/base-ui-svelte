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

	it('parent checkbox selects and clears allValues', async () => {
		const user = userEvent.setup();
		render(CheckboxGroupTest, { props: { withParent: true } });

		const parent = screen.getByTestId('checkbox-parent');
		const a = screen.getByTestId('checkbox-a');
		const b = screen.getByTestId('checkbox-b');

		expect(parent).toHaveAttribute('aria-checked', 'false');

		await user.click(parent);
		expect(parent).toHaveAttribute('aria-checked', 'true');
		expect(a).toHaveAttribute('aria-checked', 'true');
		expect(b).toHaveAttribute('aria-checked', 'true');

		await user.click(a);
		expect(parent).toHaveAttribute('aria-checked', 'mixed');
		expect(parent).toHaveAttribute('data-indeterminate');
		expect(a).toHaveAttribute('aria-checked', 'false');
		expect(b).toHaveAttribute('aria-checked', 'true');

		await user.click(parent);
		expect(parent).toHaveAttribute('aria-checked', 'true');
		expect(a).toHaveAttribute('aria-checked', 'true');
		expect(b).toHaveAttribute('aria-checked', 'true');

		await user.click(parent);
		expect(parent).toHaveAttribute('aria-checked', 'false');
		expect(a).toHaveAttribute('aria-checked', 'false');
		expect(b).toHaveAttribute('aria-checked', 'false');
	});

	it('has no axe violations', async () => {
		const { container } = render(CheckboxGroupTest);
		expect(await axe(container)).toHaveNoViolations();
	});
});
