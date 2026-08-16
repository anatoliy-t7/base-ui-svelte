import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PresenceTest from './presence.test.svelte';

describe('createPresence', () => {
	beforeEach(() => {
		vi.useFakeTimers({ shouldAdvanceTime: true });
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	it('unmounts on transitionend before the fallback timeout', async () => {
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		render(PresenceTest, { props: { fallbackMs: 5000 } });

		await user.click(screen.getByTestId('toggle'));
		expect(screen.getByTestId('node')).toBeInTheDocument();

		await user.click(screen.getByTestId('toggle'));
		const node = screen.getByTestId('node');
		expect(node).toHaveAttribute('data-status', 'hiding');
		expect(node).toHaveAttribute('data-ending');

		node.dispatchEvent(new Event('transitionend', { bubbles: true }));

		await waitFor(() => {
			expect(screen.queryByTestId('node')).toBeNull();
		});
	});

	it('falls back to timeout when no transition fires', async () => {
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		render(PresenceTest, { props: { fallbackMs: 200 } });

		await user.click(screen.getByTestId('toggle'));
		expect(screen.getByTestId('node')).toBeInTheDocument();

		await user.click(screen.getByTestId('toggle'));
		expect(screen.getByTestId('node')).toHaveAttribute('data-status', 'hiding');

		await vi.advanceTimersByTimeAsync(199);
		expect(screen.getByTestId('node')).toBeInTheDocument();

		await vi.advanceTimersByTimeAsync(1);
		await waitFor(() => {
			expect(screen.queryByTestId('node')).toBeNull();
		});
	});

	it('unmounts immediately when getAnimations returns no running animations', async () => {
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		const getAnimations = vi.fn(() => []);
		HTMLElement.prototype.getAnimations = getAnimations;

		render(PresenceTest, { props: { fallbackMs: 5000 } });

		await user.click(screen.getByTestId('toggle'));
		expect(screen.getByTestId('node')).toBeInTheDocument();

		await user.click(screen.getByTestId('toggle'));
		expect(screen.getByTestId('node')).toHaveAttribute('data-status', 'hiding');

		await vi.advanceTimersByTimeAsync(0);
		await waitFor(() => {
			expect(screen.queryByTestId('node')).toBeNull();
		});
		expect(getAnimations).toHaveBeenCalled();
	});

	it('waits for getAnimations finished before unmounting', async () => {
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		let resolveFinished: (() => void) | undefined;
		const finished = new Promise<void>((resolve) => {
			resolveFinished = resolve;
		});
		HTMLElement.prototype.getAnimations = vi.fn(() => [{ finished } as unknown as Animation]);

		render(PresenceTest, { props: { fallbackMs: 5000 } });

		await user.click(screen.getByTestId('toggle'));
		expect(screen.getByTestId('node')).toBeInTheDocument();

		await user.click(screen.getByTestId('toggle'));
		expect(screen.getByTestId('node')).toHaveAttribute('data-status', 'hiding');

		await vi.advanceTimersByTimeAsync(0);
		expect(screen.getByTestId('node')).toBeInTheDocument();

		resolveFinished?.();
		await waitFor(() => {
			expect(screen.queryByTestId('node')).toBeNull();
		});
	});
});
