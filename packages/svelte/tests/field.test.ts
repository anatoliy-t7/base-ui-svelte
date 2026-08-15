import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import FieldTest from './field.test.svelte';

describe('Field', () => {
	it('associates label with control and tracks focus data attrs', async () => {
		const user = userEvent.setup();
		render(FieldTest);

		const field = screen.getByTestId('field');
		const label = screen.getByTestId('label');
		const control = screen.getByTestId('control');
		const item = screen.getByTestId('item');

		expect(label).toHaveAttribute('for', control.id);
		expect(screen.getByTestId('validity')).toBeInTheDocument();

		await user.click(control);
		expect(field).toHaveAttribute('data-focused');
		expect(item).toHaveAttribute('data-focused');

		await user.tab();
		expect(field).toHaveAttribute('data-touched');
		expect(field).toHaveAttribute('data-invalid');
		expect(item).toHaveAttribute('data-invalid');
		expect(screen.getByTestId('error')).toHaveTextContent('Required');
		expect(screen.getByTestId('validity')).toHaveAttribute('data-invalid');
		expect(screen.getByTestId('validity')).toHaveTextContent('Required');
	});

	it('has no axe violations', async () => {
		const { container } = render(FieldTest);
		expect(await axe(container)).toHaveNoViolations();
	});
});
