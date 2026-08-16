import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import ToggleTest from './toggle.test.svelte';

describe('Toggle', () => {
	it('toggles pressed state on click', async () => {
		const user = userEvent.setup();
		render(ToggleTest);

		const toggle = screen.getByTestId('toggle');
		expect(toggle).toHaveAttribute('aria-pressed', 'false');

		await user.click(toggle);
		expect(toggle).toHaveAttribute('aria-pressed', 'true');
		expect(toggle).toHaveAttribute('data-pressed');

		await user.click(toggle);
		expect(toggle).toHaveAttribute('aria-pressed', 'false');
	});

	it('respects defaultPressed', () => {
		render(ToggleTest, { props: { defaultPressed: true } });
		expect(screen.getByTestId('toggle')).toHaveAttribute('aria-pressed', 'true');
	});

	it('does not toggle when disabled', async () => {
		const user = userEvent.setup();
		render(ToggleTest, { props: { disabled: true } });

		const toggle = screen.getByTestId('toggle');
		expect(toggle).toBeDisabled();
		expect(toggle).toHaveAttribute('data-disabled');
		await user.click(toggle);
		expect(toggle).toHaveAttribute('aria-pressed', 'false');
	});

	it('notifies onPressedChange when toggled', async () => {
		const user = userEvent.setup();
		const onPressedChange = vi.fn();
		render(ToggleTest, { props: { onPressedChange } });

		await user.click(screen.getByTestId('toggle'));
		expect(onPressedChange).toHaveBeenCalledWith(true, expect.any(Event));
	});

	it('has no axe violations', async () => {
		const { container } = render(ToggleTest);
		expect(await axe(container)).toHaveNoViolations();
	});
});
