import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import InputTest from './input.test.svelte';

describe('Input', () => {
	it('renders a native input and updates on typing', async () => {
		const user = userEvent.setup();
		render(InputTest);
		const input = screen.getByTestId('input');
		expect(input.tagName).toBe('INPUT');
		await user.type(input, 'Ada');
		expect(input).toHaveValue('Ada');
	});

	it('has no axe violations', async () => {
		const { container } = render(InputTest);
		expect(await axe(container)).toHaveNoViolations();
	});
});
