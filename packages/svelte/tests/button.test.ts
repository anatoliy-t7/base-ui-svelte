import { render, screen } from '@testing-library/svelte';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import ButtonTest from './button.test.svelte';

describe('Button', () => {
	it('renders a native button with type button by default', () => {
		render(ButtonTest);
		const button = screen.getByTestId('button');
		expect(button.tagName).toBe('BUTTON');
		expect(button).toHaveAttribute('type', 'button');
		expect(button).toHaveTextContent('Click me');
	});

	it('keeps focusability when focusableWhenDisabled', () => {
		render(ButtonTest, {
			props: { disabled: true, focusableWhenDisabled: true },
		});
		const button = screen.getByTestId('button');
		expect(button).not.toBeDisabled();
		expect(button).toHaveAttribute('aria-disabled', 'true');
		expect(button).toHaveAttribute('data-disabled');
		button.focus();
		expect(button).toHaveFocus();
	});

	it('has no axe violations', async () => {
		const { container } = render(ButtonTest);
		expect(await axe(container)).toHaveNoViolations();
	});
});
