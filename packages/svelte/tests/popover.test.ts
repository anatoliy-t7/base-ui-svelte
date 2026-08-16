import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import PopoverTest from './popover.test.svelte';

describe('Popover', () => {
	it('opens on trigger and closes on escape', async () => {
		const user = userEvent.setup();
		render(PopoverTest);

		expect(screen.getByTestId('trigger')).toHaveAttribute('aria-expanded', 'false');

		await user.click(screen.getByTestId('trigger'));
		expect(screen.getByTestId('popup')).toBeInTheDocument();
		expect(screen.getByTestId('popup')).toHaveAttribute('role', 'dialog');
		expect(screen.getByTestId('backdrop')).toBeInTheDocument();
		expect(screen.getByTestId('viewport')).toBeInTheDocument();
		expect(screen.getByTestId('trigger')).toHaveAttribute('aria-expanded', 'true');

		await user.keyboard('{Escape}');
		await waitFor(() => {
			expect(screen.queryByTestId('popup')).toBeNull();
		});
	});

	it('closes on close button', async () => {
		const user = userEvent.setup();
		render(PopoverTest);

		await user.click(screen.getByTestId('trigger'));
		await user.click(screen.getByTestId('close'));
		await waitFor(() => {
			expect(screen.queryByTestId('popup')).toBeNull();
		});
	});

	it('closes when backdrop is clicked', async () => {
		const user = userEvent.setup();
		render(PopoverTest, { props: { modal: true } });

		await user.click(screen.getByTestId('trigger'));
		expect(screen.getByTestId('popup')).toBeInTheDocument();

		await user.click(screen.getByTestId('backdrop'));
		await waitFor(() => {
			expect(screen.queryByTestId('popup')).toBeNull();
		});
	});

	it('respects defaultOpen', () => {
		render(PopoverTest, { props: { defaultOpen: true } });
		expect(screen.getByTestId('popup')).toBeInTheDocument();
		expect(screen.getByTestId('trigger')).toHaveAttribute('aria-expanded', 'true');
	});

	it('notifies onOpenChange when dismissed', async () => {
		const user = userEvent.setup();
		const onOpenChange = vi.fn();
		render(PopoverTest, { props: { defaultOpen: true, onOpenChange } });

		expect(screen.getByTestId('popup')).toBeInTheDocument();
		await user.keyboard('{Escape}');
		expect(onOpenChange).toHaveBeenCalledWith(
			false,
			expect.objectContaining({ reason: 'escape-key' }),
		);
	});

	it('has no axe violations when open', async () => {
		const user = userEvent.setup();
		const { container } = render(PopoverTest);
		await user.click(screen.getByTestId('trigger'));
		expect(await axe(container)).toHaveNoViolations();
	});
});
