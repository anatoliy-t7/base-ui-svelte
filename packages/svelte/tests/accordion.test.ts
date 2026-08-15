import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import AccordionTest from './accordion.test.svelte';

describe('Accordion', () => {
	it('opens a single item at a time by default', async () => {
		const user = userEvent.setup();
		render(AccordionTest);

		expect(screen.queryByTestId('panel-one')).toBeNull();
		expect(screen.getByTestId('trigger-one')).toHaveAttribute('aria-expanded', 'false');

		await user.click(screen.getByTestId('trigger-one'));
		expect(screen.getByTestId('panel-one')).toBeInTheDocument();
		expect(screen.getByTestId('trigger-one')).toHaveAttribute('aria-expanded', 'true');
		expect(screen.getByTestId('item-one')).toHaveAttribute('data-open');

		await user.click(screen.getByTestId('trigger-two'));
		expect(screen.getByTestId('panel-two')).toBeInTheDocument();
		await waitFor(() => {
			expect(screen.queryByTestId('panel-one')).toBeNull();
		});
		expect(screen.getByTestId('trigger-one')).toHaveAttribute('aria-expanded', 'false');
	});

	it('allows multiple open items when multiple is true', async () => {
		const user = userEvent.setup();
		render(AccordionTest, { multiple: true });

		await user.click(screen.getByTestId('trigger-one'));
		await user.click(screen.getByTestId('trigger-two'));

		expect(screen.getByTestId('panel-one')).toBeInTheDocument();
		expect(screen.getByTestId('panel-two')).toBeInTheDocument();
		expect(screen.getByTestId('trigger-one')).toHaveAttribute('aria-expanded', 'true');
		expect(screen.getByTestId('trigger-two')).toHaveAttribute('aria-expanded', 'true');
	});

	it('respects defaultValue', () => {
		render(AccordionTest, { defaultValue: 'two' });
		expect(screen.getByTestId('panel-two')).toBeInTheDocument();
		expect(screen.getByTestId('trigger-two')).toHaveAttribute('aria-expanded', 'true');
		expect(screen.queryByTestId('panel-one')).toBeNull();
	});

	it('has no axe violations when open', async () => {
		const user = userEvent.setup();
		const { container } = render(AccordionTest);
		await user.click(screen.getByTestId('trigger-one'));
		expect(await axe(container)).toHaveNoViolations();
	});
});
