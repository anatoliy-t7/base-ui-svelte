import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import RadioTest from './radio.test.svelte';

describe('Radio', () => {
	it('selects a radio on click and moves with arrow keys', async () => {
		const user = userEvent.setup();
		render(RadioTest);

		const group = screen.getByTestId('radio-group');
		const a = screen.getByTestId('radio-a');
		const b = screen.getByTestId('radio-b');

		expect(group).toHaveAttribute('role', 'radiogroup');
		expect(a).toHaveAttribute('aria-checked', 'false');

		await user.click(a);
		expect(a).toHaveAttribute('aria-checked', 'true');
		expect(a).toHaveAttribute('data-checked');
		expect(screen.getByTestId('indicator-a')).toBeInTheDocument();

		a.focus();
		await user.keyboard('{ArrowDown}');
		expect(b).toHaveAttribute('aria-checked', 'true');
		expect(a).toHaveAttribute('aria-checked', 'false');
		expect(b).toHaveFocus();
	});

	it('respects defaultValue', () => {
		render(RadioTest, { props: { defaultValue: 'b' } });
		expect(screen.getByTestId('radio-b')).toHaveAttribute('aria-checked', 'true');
		expect(screen.getByTestId('radio-a')).toHaveAttribute('aria-checked', 'false');
	});

	it('does not change when disabled', async () => {
		const user = userEvent.setup();
		render(RadioTest, { props: { disabled: true, defaultValue: 'a' } });

		const group = screen.getByTestId('radio-group');
		const a = screen.getByTestId('radio-a');
		const b = screen.getByTestId('radio-b');

		expect(group).toHaveAttribute('data-disabled');
		await user.click(b);
		expect(a).toHaveAttribute('aria-checked', 'true');
		expect(b).toHaveAttribute('aria-checked', 'false');
	});

	it('notifies onValueChange when selection changes', async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(RadioTest, { props: { defaultValue: 'a', onValueChange } });

		await user.click(screen.getByTestId('radio-b'));
		expect(onValueChange).toHaveBeenCalledWith('b', expect.any(Event));
	});

	it('has no axe violations', async () => {
		const { container } = render(RadioTest);
		expect(await axe(container)).toHaveNoViolations();
	});
});
