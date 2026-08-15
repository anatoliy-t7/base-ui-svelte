import { render, screen } from '@testing-library/svelte';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import MeterTest from './meter.test.svelte';

describe('Meter', () => {
	it('exposes meter semantics and indicator width', () => {
		render(MeterTest);

		const root = screen.getByTestId('meter');
		expect(root).toHaveAttribute('role', 'meter');
		expect(root).toHaveAttribute('aria-valuenow', '70');
		expect(root).toHaveAttribute('data-progressing');
		expect(root).not.toHaveAttribute('data-indeterminate');

		expect(screen.getByTestId('value')).toHaveTextContent('70');
		expect(screen.getByTestId('indicator')).toHaveStyle({ width: '70%', height: '100%' });
	});

	it('has no axe violations', async () => {
		const { container } = render(MeterTest);
		expect(await axe(container)).toHaveNoViolations();
	});
});
