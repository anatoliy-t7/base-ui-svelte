import { render, screen } from '@testing-library/svelte';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import ProgressTest from './progress.test.svelte';

describe('Progress', () => {
	it('exposes progressbar semantics and formatted value', () => {
		render(ProgressTest);

		const root = screen.getByTestId('progress');
		expect(root).toHaveAttribute('role', 'progressbar');
		expect(root).toHaveAttribute('aria-valuemin', '0');
		expect(root).toHaveAttribute('aria-valuemax', '100');
		expect(root).toHaveAttribute('aria-valuenow', '40');
		expect(root).toHaveAttribute('data-progressing');

		const label = screen.getByTestId('label');
		expect(root).toHaveAttribute('aria-labelledby', label.id);

		expect(screen.getByTestId('value')).toHaveTextContent('40');
		expect(screen.getByTestId('indicator')).toHaveStyle({ width: '40%', height: '100%' });
	});

	it('has no axe violations', async () => {
		const { container } = render(ProgressTest);
		expect(await axe(container)).toHaveNoViolations();
	});
});
