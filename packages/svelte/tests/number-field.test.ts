import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import NumberFieldTest from './number-field.test.svelte';

describe('NumberField', () => {
	it('increments and decrements within bounds', async () => {
		const user = userEvent.setup();
		render(NumberFieldTest);

		const input = screen.getByTestId('input');
		expect(input).toHaveAttribute('inputmode', 'decimal');
		expect(input).toHaveValue('5');

		await user.click(screen.getByTestId('increment'));
		expect(input).toHaveValue('6');

		await user.click(screen.getByTestId('decrement'));
		expect(input).toHaveValue('5');
	});

	it('clamps on blur and disables buttons at bounds', async () => {
		const user = userEvent.setup();
		render(NumberFieldTest);

		const input = screen.getByTestId('input');
		await user.clear(input);
		await user.type(input, '99');
		await user.tab();
		expect(input).toHaveValue('10');
		expect(screen.getByTestId('increment')).toBeDisabled();

		await user.clear(input);
		await user.type(input, '-5');
		await user.tab();
		expect(input).toHaveValue('0');
		expect(screen.getByTestId('decrement')).toBeDisabled();
	});

	it('scrubs value via pointer drag on ScrubArea', async () => {
		const user = userEvent.setup();
		render(NumberFieldTest);

		const scrub = screen.getByTestId('scrub-area');
		const input = screen.getByTestId('input');

		await user.pointer([
			{ keys: '[MouseLeft>]', target: scrub, coords: { x: 100, y: 10 } },
			{ coords: { x: 110, y: 10 } },
			{ keys: '[/MouseLeft]' }
		]);

		expect(input).toHaveValue('10');
		expect(screen.getByTestId('root')).not.toHaveAttribute('data-scrubbing');
		expect(screen.queryByTestId('scrub-cursor')).toBeNull();
	});

	it('renders a hidden input when name is set', () => {
		render(NumberFieldTest);
		const hidden = document.querySelector('input[type="hidden"][name="qty"]');
		expect(hidden).not.toBeNull();
		expect(hidden).toHaveValue('5');
	});

	it('has no axe violations', async () => {
		const { container } = render(NumberFieldTest);
		expect(await axe(container)).toHaveNoViolations();
	});
});
