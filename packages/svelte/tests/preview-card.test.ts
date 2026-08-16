import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import PreviewCardTest from './preview-card.test.svelte';

describe('PreviewCard', () => {
	it('shows on hover after delay', async () => {
		const user = userEvent.setup();
		render(PreviewCardTest);

		await user.hover(screen.getByTestId('trigger'));
		await waitFor(() => {
			expect(screen.getByTestId('popup')).toBeInTheDocument();
		});
		expect(screen.getByTestId('trigger')).toHaveAttribute(
			'aria-describedby',
			screen.getByTestId('popup').id,
		);
	});

	it('hides on Escape', async () => {
		const user = userEvent.setup();
		render(PreviewCardTest);

		await user.hover(screen.getByTestId('trigger'));
		await waitFor(() => {
			expect(screen.getByTestId('popup')).toBeInTheDocument();
		});

		await user.keyboard('{Escape}');
		await waitFor(() => {
			expect(screen.queryByTestId('popup')).toBeNull();
		});
	});

	it('has no axe violations when open', async () => {
		const user = userEvent.setup();
		const { container } = render(PreviewCardTest);
		await user.hover(screen.getByTestId('trigger'));
		await waitFor(() => {
			expect(screen.getByTestId('popup')).toBeInTheDocument();
		});
		expect(await axe(container)).toHaveNoViolations();
	});
});
