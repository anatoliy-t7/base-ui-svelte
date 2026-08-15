import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import NavigationMenuTest from './navigation-menu.test.svelte';

describe('NavigationMenu', () => {
	it('opens trigger content and closes on Escape', async () => {
		const user = userEvent.setup();
		render(NavigationMenuTest);

		const trigger = screen.getByTestId('products-trigger');
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
		expect(screen.queryByTestId('popup')).toBeNull();

		await user.click(trigger);
		expect(trigger).toHaveAttribute('aria-expanded', 'true');
		expect(screen.getByTestId('popup')).toBeInTheDocument();
		expect(screen.getByTestId('backdrop')).toBeInTheDocument();
		expect(screen.getByTestId('arrow')).toBeInTheDocument();
		expect(screen.getByTestId('icon')).toBeInTheDocument();
		expect(screen.getByTestId('products-content')).toBeInTheDocument();
		expect(screen.queryByTestId('company-content')).toBeNull();

		await user.click(screen.getByTestId('backdrop'));
		await waitFor(() => {
			expect(screen.queryByTestId('popup')).toBeNull();
		});

		await user.click(trigger);
		await user.click(screen.getByTestId('company-trigger'));
		expect(screen.getByTestId('company-content')).toBeInTheDocument();
		expect(screen.queryByTestId('products-content')).toBeNull();

		await user.keyboard('{Escape}');
		await waitFor(() => {
			expect(screen.queryByTestId('popup')).toBeNull();
		});
		expect(screen.getByTestId('products-trigger')).toHaveAttribute('aria-expanded', 'false');
	});

	it('renders top-level links without a popup', () => {
		render(NavigationMenuTest);
		const link = screen.getByTestId('docs-link');
		expect(link.tagName).toBe('A');
		expect(link).toHaveAttribute('href', '/docs');
		expect(screen.queryByTestId('popup')).toBeNull();
	});

	it('has no axe violations when open', async () => {
		const user = userEvent.setup();
		const { container } = render(NavigationMenuTest);
		await user.click(screen.getByTestId('products-trigger'));
		expect(await axe(container)).toHaveNoViolations();
	});
});
