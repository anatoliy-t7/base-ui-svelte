import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
import type { OpenChangeReason } from '../internal/controllable.svelte.js';
import type { Align, Side } from '../internal/floating.svelte.js';
import type { PopupHandle } from '../internal/popup-handle.js';
import type { createPresence } from '../internal/presence.svelte.js';

export type PopoverHandle<Payload = unknown> = PopupHandle<Payload>;

export type PopoverModal = boolean | 'trap-focus';

export type PopoverRefs = {
	trigger: HTMLElement | null;
	popup: HTMLElement | null;
	arrow: HTMLElement | null;
	positioner: HTMLElement | null;
};

export type PopoverContext = {
	readonly open: boolean;
	setOpen(open: boolean, reason: OpenChangeReason): void;
	openWithHoverDelay(reason: OpenChangeReason): void;
	closeWithHoverDelay(reason: OpenChangeReason): void;
	cancelHover(): void;
	readonly openOnHover: boolean;
	readonly delay: number;
	readonly closeDelay: number;
	readonly modal: PopoverModal;
	readonly lastOpenChangeReason: OpenChangeReason | null;
	readonly triggerId: string;
	readonly titleId: string;
	readonly descriptionId: string;
	readonly popupId: string;
	readonly refs: PopoverRefs;
	readonly presence: ReturnType<typeof createPresence>;
	readonly payload: unknown;
};

export type PopoverRootProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	open?: boolean | undefined;
	defaultOpen?: boolean;
	onOpenChange?: ((open: boolean, eventDetails: { reason: OpenChangeReason }) => void) | undefined;
	openOnHover?: boolean;
	/** Open delay when `openOnHover` is set (ms). @default 0 */
	delay?: number;
	/** Close delay when leaving under hover (ms). @default 0 */
	closeDelay?: number;
	/**
	 * Whether the popover enters a modal state when open.
	 * - `true`: document scroll locked (except hover-open), outside interaction limited
	 * - `false`: no scroll lock
	 * - `'trap-focus'`: focus trap without scroll lock
	 * @default false
	 */
	modal?: PopoverModal;
	/** Imperative handle from {@link createHandle}. */
	handle?: PopoverHandle | undefined;
	children?: Snippet<[{ open: boolean; payload: unknown }]>;
};

export type PopoverTriggerProps = Omit<HTMLButtonAttributes, 'children' | 'disabled' | 'id'> & {
	render?: string;
	disabled?: boolean;
	id?: string | undefined;
	/** Same handle as Root — enables triggers outside the Root tree. */
	handle?: PopoverHandle | undefined;
	/** Optional payload associated when opening via this trigger. */
	payload?: unknown;
	openOnHover?: boolean;
	children?: Snippet;
};

export type PopoverPortalProps = {
	container?: HTMLElement | string | null;
	keepMounted?: boolean;
	children?: Snippet;
};

export type PopoverBackdropProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	children?: Snippet;
};

export type PopoverViewportProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	children?: Snippet;
};

export type PopoverPositionerProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	side?: Side;
	align?: Align;
	sideOffset?: number;
	children?: Snippet;
};

export type PopoverPopupProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	children?: Snippet;
};

export type PopoverArrowProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	children?: Snippet;
};

export type PopoverTitleProps = Omit<HTMLAttributes<HTMLHeadingElement>, 'children'> & {
	children?: Snippet;
};

export type PopoverDescriptionProps = Omit<HTMLAttributes<HTMLParagraphElement>, 'children'> & {
	children?: Snippet;
};

export type PopoverCloseProps = Omit<HTMLButtonAttributes, 'children'> & {
	render?: string;
	children?: Snippet;
};
