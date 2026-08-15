import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import CollapsibleTest from './collapsible.test.svelte';

describe('Collapsible', () => {
	it('toggles panel open and closed via trigger', async () => {
		const user = userEvent.setup();
		render(CollapsibleTest);

		expect(screen.queryByTestId('panel')).toBeNull();
		expect(screen.getByTestId('trigger')).toHaveAttribute('aria-expanded', 'false');
		expect(screen.getByTestId('collapsible-root')).toHaveAttribute('data-closed');

		await user.click(screen.getByTestId('trigger'));
		expect(screen.getByTestId('panel')).toBeInTheDocument();
		expect(screen.getByTestId('trigger')).toHaveAttribute('aria-expanded', 'true');
		expect(screen.getByTestId('trigger')).toHaveAttribute('data-panel-open');
		expect(screen.getByTestId('collapsible-root')).toHaveAttribute('data-open');
		expect(screen.getByTestId('panel')).toHaveAttribute('data-open');

		await user.click(screen.getByTestId('trigger'));
		await waitFor(() => {
			expect(screen.queryByTestId('panel')).toBeNull();
		});
		expect(screen.getByTestId('trigger')).toHaveAttribute('aria-expanded', 'false');
	});

	it('links trigger to panel with aria-controls', async () => {
		const user = userEvent.setup();
		render(CollapsibleTest);

		await user.click(screen.getByTestId('trigger'));
		const panelId = screen.getByTestId('panel').id;
		expect(screen.getByTestId('trigger')).toHaveAttribute('aria-controls', panelId);
	});

	it('has no axe violations when open', async () => {
		const user = userEvent.setup();
		const { container } = render(CollapsibleTest);
		await user.click(screen.getByTestId('trigger'));
		expect(await axe(container)).toHaveNoViolations();
	});
});
