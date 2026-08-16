import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import TabsTest from './tabs.test.svelte';

describe('Tabs', () => {
	it('switches panels on tab click and arrow keys', async () => {
		const user = userEvent.setup();
		render(TabsTest);

		expect(screen.getByTestId('tab-one')).toHaveAttribute('aria-selected', 'true');
		expect(screen.getByTestId('panel-two')).toHaveAttribute('hidden');

		await user.click(screen.getByTestId('tab-two'));
		expect(screen.getByTestId('tab-two')).toHaveAttribute('aria-selected', 'true');
		expect(screen.getByTestId('panel-one')).toHaveAttribute('hidden');

		screen.getByTestId('tab-two').focus();
		await user.keyboard('{ArrowLeft}');
		expect(screen.getByTestId('tab-one')).toHaveAttribute('aria-selected', 'true');
	});

	it('exposes active tab CSS variables on the indicator', async () => {
		const user = userEvent.setup();
		render(TabsTest);

		const indicator = await waitFor(() => screen.getByTestId('indicator'));
		await waitFor(() => {
			expect(indicator.style.getPropertyValue('--active-tab-width')).toMatch(/px$/);
		});

		await user.click(screen.getByTestId('tab-two'));
		await waitFor(() => {
			expect(indicator.style.getPropertyValue('--active-tab-left')).toMatch(/px$/);
		});
	});

	it('has no axe violations', async () => {
		const { container } = render(TabsTest);
		expect(await axe(container)).toHaveNoViolations();
	});
});
