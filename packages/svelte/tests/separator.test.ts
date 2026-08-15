import { render, screen } from '@testing-library/svelte';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import SeparatorTest from './separator.test.svelte';

describe('Separator', () => {
	it('renders horizontal and vertical separators', () => {
		render(SeparatorTest);

		const horizontal = screen.getByTestId('separator');
		expect(horizontal).toHaveAttribute('role', 'separator');
		expect(horizontal).toHaveAttribute('data-orientation', 'horizontal');
		expect(horizontal).not.toHaveAttribute('aria-orientation');

		const vertical = screen.getByTestId('separator-vertical');
		expect(vertical).toHaveAttribute('data-orientation', 'vertical');
		expect(vertical).toHaveAttribute('aria-orientation', 'vertical');
	});

	it('has no axe violations', async () => {
		const { container } = render(SeparatorTest);
		expect(await axe(container)).toHaveNoViolations();
	});
});
