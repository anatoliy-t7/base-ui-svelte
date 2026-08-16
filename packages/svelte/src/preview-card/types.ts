import type { Snippet } from 'svelte';
import type { HTMLAnchorAttributes, HTMLAttributes } from 'svelte/elements';
import type { OpenChangeReason } from '../internal/controllable.svelte.js';
import type { Align, Side } from '../internal/floating.svelte.js';
import type { PopupHandle } from '../internal/popup-handle.js';
import type { createPresence } from '../internal/presence.svelte.js';

export type PreviewCardHandle<Payload = unknown> = PopupHandle<Payload>;

export type PreviewCardRefs = {
	trigger: HTMLElement | null;
	popup: HTMLElement | null;
	arrow: HTMLElement | null;
	positioner: HTMLElement | null;
};

export type PreviewCardContext = {
	readonly open: boolean;
	setOpen(open: boolean, reason: OpenChangeReason): void;
	openWithDelay(reason: OpenChangeReason): void;
	closeWithDelay(reason: OpenChangeReason): void;
	cancelClose(): void;
	readonly triggerId: string;
	readonly popupId: string;
	readonly refs: PreviewCardRefs;
	readonly presence: ReturnType<typeof createPresence>;
	readonly openDelay: number;
	readonly closeDelay: number;
	readonly payload: unknown;
};

export type PreviewCardRootProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	open?: boolean | undefined;
	defaultOpen?: boolean;
	onOpenChange?: ((open: boolean, eventDetails: { reason: OpenChangeReason }) => void) | undefined;
	openDelay?: number;
	closeDelay?: number;
	/** Imperative handle from {@link createHandle}. */
	handle?: PreviewCardHandle | undefined;
	children?: Snippet<[{ open: boolean; payload: unknown }]>;
};

export type PreviewCardTriggerProps = Omit<HTMLAnchorAttributes, 'children' | 'id'> & {
	render?: string;
	disabled?: boolean;
	id?: string | undefined;
	/** Same handle as Root — enables triggers outside the Root tree. */
	handle?: PreviewCardHandle | undefined;
	/** Optional payload associated when opening via this trigger. */
	payload?: unknown;
	children?: Snippet;
};

export type PreviewCardPortalProps = {
	children?: Snippet;
};

export type PreviewCardBackdropProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	children?: Snippet;
};

export type PreviewCardPositionerProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	side?: Side;
	align?: Align;
	sideOffset?: number;
	children?: Snippet;
};

export type PreviewCardPopupProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	children?: Snippet;
};

export type PreviewCardArrowProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	children?: Snippet;
};

export type PreviewCardViewportProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	children?: Snippet;
};
