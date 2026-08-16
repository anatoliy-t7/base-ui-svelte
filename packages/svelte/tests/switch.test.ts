import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import SwitchTest from './switch.test.svelte';

describe('Switch', () => {
	it('toggles on click', async () => {
		const user = userEvent.setup();
		render(SwitchTest);
		const el = screen.getByTestId('switch');
		expect(el).toHaveAttribute('aria-checked', 'false');
		await user.click(el);
		expect(el).toHaveAttribute('aria-checked', 'true');
		expect(el).toHaveAttribute('role', 'switch');
	});

	it('toggles on Space', async () => {
		const user = userEvent.setup();
		render(SwitchTest);
		const el = screen.getByTestId('switch');
		el.focus();
		await user.keyboard(' ');
		expect(el).toHaveAttribute('aria-checked', 'true');
	});

	it('respects defaultChecked', () => {
		render(SwitchTest, { props: { defaultChecked: true } });
		expect(screen.getByTestId('switch')).toHaveAttribute('aria-checked', 'true');
	});

	it('does not toggle when disabled', async () => {
		const user = userEvent.setup();
		render(SwitchTest, { props: { disabled: true } });

		const el = screen.getByTestId('switch');
		expect(el).toBeDisabled();
		expect(el).toHaveAttribute('data-disabled');
		await user.click(el);
		expect(el).toHaveAttribute('aria-checked', 'false');
	});

	it('notifies onCheckedChange when toggled', async () => {
		const user = userEvent.setup();
		const onCheckedChange = vi.fn();
		render(SwitchTest, { props: { onCheckedChange } });

		await user.click(screen.getByTestId('switch'));
		expect(onCheckedChange).toHaveBeenCalledWith(true, expect.any(Event));
	});

	it('has no axe violations', async () => {
		const { container } = render(SwitchTest);
		expect(await axe(container)).toHaveNoViolations();
	});
});
