import { render, screen, waitFor } from '@testing-library/svelte';
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
		expect(screen.getByTestId('validity')).toHaveAttribute('data-custom-error');
		expect(screen.getByTestId('validity')).toHaveTextContent('Required');
	});

	it('reports valueMissing for required empty control', async () => {
		const user = userEvent.setup();
		render(FieldTest, { props: { mode: 'required' } });

		const control = screen.getByTestId('control');
		await user.click(control);
		await user.tab();

		await waitFor(() => {
			expect(screen.getByTestId('field')).toHaveAttribute('data-invalid');
		});
		expect(screen.getByTestId('validity')).toHaveAttribute('data-value-missing');
		expect(screen.getByTestId('error')).toBeInTheDocument();
	});

	it('reports typeMismatch for invalid email', async () => {
		const user = userEvent.setup();
		render(FieldTest, { props: { mode: 'email' } });

		const control = screen.getByTestId('control');
		await user.type(control, 'not-an-email');
		await user.tab();

		await waitFor(() => {
			expect(screen.getByTestId('field')).toHaveAttribute('data-invalid');
		});
		expect(screen.getByTestId('validity')).toHaveAttribute('data-type-mismatch');
	});

	it('shows Field.Error when match is a ValidityState key', async () => {
		const user = userEvent.setup();
		render(FieldTest, { props: { mode: 'match' } });

		expect(screen.queryByTestId('error-value-missing')).not.toBeInTheDocument();

		const control = screen.getByTestId('control');
		await user.click(control);
		await user.tab();

		await waitFor(() => {
			expect(screen.getByTestId('error-value-missing')).toHaveTextContent('Value is required');
		});
		expect(screen.queryByTestId('error-custom')).not.toBeInTheDocument();
	});

	it('has no axe violations', async () => {
		const { container } = render(FieldTest);
		expect(await axe(container)).toHaveNoViolations();
	});
});
