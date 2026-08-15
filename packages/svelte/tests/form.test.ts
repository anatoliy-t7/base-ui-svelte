import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import FormTest from './form.test.svelte';

describe('Form', () => {
	it('prevents default and calls onFormSubmit with FormData', async () => {
		const user = userEvent.setup();
		const onFormSubmit = vi.fn();
		render(FormTest, { props: { onFormSubmit } });

		const control = screen.getByTestId('control');
		await user.type(control, 'ada');
		await user.click(screen.getByRole('button', { name: 'Submit' }));

		expect(onFormSubmit).toHaveBeenCalledTimes(1);
		const formData = onFormSubmit.mock.calls[0]?.[0] as FormData;
		expect(formData.get('username')).toBe('ada');
	});

	it('surfaces server errors on Field.Error', () => {
		render(FormTest, {
			props: { errors: { username: 'Taken' } }
		});
		expect(screen.getByTestId('error')).toHaveTextContent('Taken');
		expect(screen.getByTestId('field')).toHaveAttribute('data-invalid');
	});

	it('has no axe violations', async () => {
		const { container } = render(FormTest);
		expect(await axe(container)).toHaveNoViolations();
	});
});
