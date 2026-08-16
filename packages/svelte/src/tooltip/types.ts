import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
import type { OpenChangeReason } from '../internal/controllable.svelte.js';
import type { Align, Side } from '../internal/floating.svelte.js';
import type { PopupHandle } from '../internal/popup-handle.js';
import type { createPresence } from '../internal/presence.svelte.js';

export type TooltipHandle<Payload = unknown> = PopupHandle<Payload>;

export type TooltipRefs = {
	trigger: HTMLElement | null;
	popup: HTMLElement | null;
	arrow: HTMLElement | null;
	positioner: HTMLElement | null;
};

export type TooltipProviderContext = {
	readonly delay: number | undefined;
	readonly closeDelay: number | undefined;
	readonly timeout: number;
	markClosed(): void;
	shouldOpenInstantly(): boolean;
};

export type TooltipContext = {
	readonly open: boolean;
	setOpen(open: boolean, reason: OpenChangeReason): void;
	openWithDelay(reason: OpenChangeReason): void;
	closeWithDelay(reason: OpenChangeReason): void;
	cancelClose(): void;
	readonly triggerId: string;
	readonly popupId: string;
	readonly refs: TooltipRefs;
	readonly presence: ReturnType<typeof createPresence>;
	readonly openDelay: number;
	readonly closeDelay: number;
	readonly payload: unknown;
};

export type TooltipProviderProps = {
	/** Shared open delay for nested tooltips (ms). */
	delay?: number;
	/** Shared close delay for nested tooltips (ms). */
	closeDelay?: number;
	/**
	 * Another tooltip opens instantly if the previous one closed within this window (ms).
	 * @default 400
	 */
	timeout?: number;
	children?: Snippet;
};

export type TooltipRootProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	open?: boolean | undefined;
	defaultOpen?: boolean;
	onOpenChange?: ((open: boolean, eventDetails: { reason: OpenChangeReason }) => void) | undefined;
	/** Alias for `openDelay` (Base UI name). @default 600 */
	delay?: number;
	/** How long to wait before opening on hover (ms). @default 600 */
	openDelay?: number;
	closeDelay?: number;
	/** Imperative handle from {@link createHandle}. */
	handle?: TooltipHandle | undefined;
	children?: Snippet<[{ open: boolean; payload: unknown }]>;
};

export type TooltipTriggerProps = Omit<HTMLButtonAttributes, 'children' | 'disabled' | 'id'> & {
	render?: string;
	disabled?: boolean;
	id?: string | undefined;
	/** Same handle as Root — enables triggers outside the Root tree. */
	handle?: TooltipHandle | undefined;
	/** Optional payload associated when opening via this trigger. */
	payload?: unknown;
	children?: Snippet;
};

export type TooltipPortalProps = {
	container?: HTMLElement | string | null;
	keepMounted?: boolean;
	children?: Snippet;
};

export type TooltipPositionerProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	side?: Side;
	align?: Align;
	sideOffset?: number;
	children?: Snippet;
};

export type TooltipPopupProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	children?: Snippet;
};

export type TooltipArrowProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	children?: Snippet;
};

export type TooltipViewportProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	children?: Snippet;
};
