import { render, screen } from '@testing-library/svelte';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import FieldsetTest from './fieldset.test.svelte';

describe('Fieldset', () => {
	it('renders fieldset and legend', () => {
		render(FieldsetTest);
		expect(screen.getByTestId('fieldset').tagName).toBe('FIELDSET');
		expect(screen.getByTestId('legend').tagName).toBe('LEGEND');
		expect(screen.getByTestId('legend')).toHaveTextContent('Billing');
	});

	it('has no axe violations', async () => {
		const { container } = render(FieldsetTest);
		expect(await axe(container)).toHaveNoViolations();
	});
});
