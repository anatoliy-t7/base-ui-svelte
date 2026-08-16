import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import OtpFieldTest from './otp-field.test.svelte';

describe('OTPField', () => {
	it('auto-registers inputs and advances focus on type', async () => {
		const user = userEvent.setup();
		render(OtpFieldTest);

		const first = screen.getByTestId('digit-0');
		const second = screen.getByTestId('digit-1');
		await user.click(first);
		await user.keyboard('1');
		expect(first).toHaveValue('1');
		await waitFor(() => {
			expect(second).toHaveFocus();
		});
	});

	it('pastes across slots and supports backspace navigation', async () => {
		const user = userEvent.setup();
		render(OtpFieldTest);

		const first = screen.getByTestId('digit-0');
		first.focus();
		await fireEvent.paste(first, {
			clipboardData: {
				getData: () => '9876',
			},
		});

		expect(screen.getByTestId('digit-0')).toHaveValue('9');
		expect(screen.getByTestId('digit-1')).toHaveValue('8');
		expect(screen.getByTestId('digit-2')).toHaveValue('7');
		expect(screen.getByTestId('digit-3')).toHaveValue('6');

		const last = screen.getByTestId('digit-3');
		await user.click(last);
		await user.keyboard('{Backspace}');
		expect(last).toHaveValue('');
		await user.keyboard('{Backspace}');
		await waitFor(() => {
			expect(screen.getByTestId('digit-2')).toHaveFocus();
		});
		expect(screen.getByTestId('digit-2')).toHaveValue('');
	});

	it('renders a hidden input when name is set', () => {
		render(OtpFieldTest);
		expect(document.querySelector('input[type="hidden"][name="otp"]')).not.toBeNull();
	});

	it('has no axe violations', async () => {
		const { container } = render(OtpFieldTest);
		expect(await axe(container)).toHaveNoViolations();
	});
});
