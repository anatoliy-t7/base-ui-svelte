import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
import type { OpenChangeReason } from '../internal/controllable.svelte.js';
import type { Align, Side } from '../internal/floating.svelte.js';
import type { createPresence } from '../internal/presence.svelte.js';

export type TooltipRefs = {
	trigger: HTMLElement | null;
	popup: HTMLElement | null;
	arrow: HTMLElement | null;
	positioner: HTMLElement | null;
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
};

export type TooltipRootProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	open?: boolean | undefined;
	defaultOpen?: boolean;
	onOpenChange?:
		| ((open: boolean, eventDetails: { reason: OpenChangeReason }) => void)
		| undefined;
	/** Alias for `openDelay` (Base UI name). @default 600 */
	delay?: number;
	/** How long to wait before opening on hover (ms). @default 600 */
	openDelay?: number;
	closeDelay?: number;
	children?: Snippet<[{ open: boolean }]>;
};

export type TooltipTriggerProps = Omit<HTMLButtonAttributes, 'children' | 'disabled'> & {
	render?: string;
	disabled?: boolean;
	children?: Snippet;
};

export type TooltipPortalProps = {
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
