import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { afterEach, describe, expect, it, vi } from 'vitest';
import DrawerTest from './drawer.test.svelte';

describe('Drawer', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('opens and closes with trigger, escape, and close button', async () => {
		const user = userEvent.setup();
		render(DrawerTest);

		expect(screen.queryByTestId('popup')).toBeNull();
		expect(screen.getByTestId('trigger')).toHaveAttribute('aria-expanded', 'false');
		expect(screen.getByTestId('indent')).toHaveAttribute('data-inactive');
		expect(screen.getByTestId('indent-background')).toHaveAttribute('data-inactive');
		expect(screen.getByTestId('swipe-area')).toBeInTheDocument();

		await user.click(screen.getByTestId('trigger'));
		expect(screen.getByTestId('popup')).toBeInTheDocument();
		expect(screen.getByTestId('popup')).toHaveAttribute('role', 'dialog');
		expect(screen.getByTestId('popup')).toHaveAttribute('aria-modal', 'true');
		expect(screen.getByTestId('trigger')).toHaveAttribute('aria-expanded', 'true');
		expect(screen.getByTestId('indent')).toHaveAttribute('data-active');
		expect(screen.getByTestId('indent-background')).toHaveAttribute('data-active');
		expect(screen.queryByTestId('swipe-area')).toBeNull();

		await user.keyboard('{Escape}');
		await waitFor(() => {
			expect(screen.queryByTestId('popup')).toBeNull();
		});

		await user.click(screen.getByTestId('trigger'));
		await user.click(screen.getByTestId('close'));
		await waitFor(() => {
			expect(screen.queryByTestId('popup')).toBeNull();
		});
	});

	it('does not start dismiss swipe from Close or Content mouse pointerdown', async () => {
		const user = userEvent.setup();
		render(DrawerTest);
		await user.click(screen.getByTestId('trigger'));

		const popup = screen.getByTestId('popup');
		const close = screen.getByTestId('close');
		const content = screen.getByTestId('content');

		close.dispatchEvent(
			new PointerEvent('pointerdown', {
				bubbles: true,
				button: 0,
				pointerId: 1,
				clientX: 10,
				clientY: 10,
				pointerType: 'touch',
			}),
		);
		expect(popup).not.toHaveAttribute('data-swiping');

		content.dispatchEvent(
			new PointerEvent('pointerdown', {
				bubbles: true,
				button: 0,
				pointerId: 2,
				clientX: 20,
				clientY: 20,
				pointerType: 'mouse',
			}),
		);
		expect(popup).not.toHaveAttribute('data-swiping');
	});

	it('locks document scroll while open', async () => {
		const user = userEvent.setup();
		render(DrawerTest);

		await user.click(screen.getByTestId('trigger'));
		await waitFor(() => {
			const html = document.documentElement;
			const body = document.body;
			const locked =
				html.style.overflow === 'hidden' ||
				html.style.overflowY === 'hidden' ||
				body.style.overflow === 'hidden' ||
				body.style.overflowY === 'hidden' ||
				html.hasAttribute('data-base-ui-scroll-locked');
			expect(locked).toBe(true);
		});

		await user.click(screen.getByTestId('close'));
		await waitFor(() => {
			expect(screen.queryByTestId('popup')).toBeNull();
			expect(document.documentElement.style.overflow).toBe('');
			expect(document.documentElement.style.overflowY).toBe('');
			expect(document.documentElement.style.overflowX).toBe('');
			expect(document.body.style.overflow).toBe('');
			expect(document.body.style.overflowY).toBe('');
			expect(document.documentElement.hasAttribute('data-base-ui-scroll-locked')).toBe(false);
		});
	});

	it('opens from swipe area when closed', async () => {
		const user = userEvent.setup();
		render(DrawerTest);
		await user.click(screen.getByTestId('swipe-area'));
		expect(screen.getByTestId('popup')).toBeInTheDocument();
	});

	it('renders with snapPoints without error', async () => {
		const user = userEvent.setup();
		render(DrawerTest, { snapPoints: [0.5, 1] });
		await user.click(screen.getByTestId('trigger'));
		const popup = screen.getByTestId('popup');
		expect(popup).toBeInTheDocument();
		expect(popup.style.getPropertyValue('--drawer-swipe-strength')).toBe('1');
	});

	it('VirtualKeyboardProvider sets --drawer-keyboard-inset from visualViewport', async () => {
		const listeners = new Map<string, Set<EventListener>>();

		const visualViewport = {
			height: 500,
			offsetTop: 0,
			addEventListener: (type: string, listener: EventListener) => {
				const set = listeners.get(type) ?? new Set();
				set.add(listener);
				listeners.set(type, set);
			},
			removeEventListener: (type: string, listener: EventListener) => {
				listeners.get(type)?.delete(listener);
			},
		};

		Object.defineProperty(window, 'visualViewport', {
			configurable: true,
			value: visualViewport,
		});
		Object.defineProperty(window, 'innerHeight', {
			configurable: true,
			value: 800,
		});

		const user = userEvent.setup();
		render(DrawerTest, { withVirtualKeyboard: true });

		const provider = screen.getByTestId('vk-provider');
		expect(provider.style.getPropertyValue('--drawer-keyboard-inset')).toBe('300px');
		expect(provider).toHaveAttribute('data-keyboard-open');

		await user.click(screen.getByTestId('trigger'));
		const popup = screen.getByTestId('popup');
		expect(popup.style.getPropertyValue('--drawer-keyboard-inset')).toBe('300px');
		expect(screen.getByTestId('viewport').style.getPropertyValue('--drawer-keyboard-inset')).toBe(
			'300px',
		);
	});

	it('has no axe violations when open', async () => {
		const user = userEvent.setup();
		const { container } = render(DrawerTest);
		await user.click(screen.getByTestId('trigger'));
		expect(await axe(container)).toHaveNoViolations();
	});
});
