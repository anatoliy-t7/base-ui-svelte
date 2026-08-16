import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
import type { OpenChangeReason } from '../internal/controllable.svelte.js';
import type { FocusTarget } from '../internal/focus-trap.svelte.js';
import type { PopupHandle } from '../internal/popup-handle.js';
import type { createPresence } from '../internal/presence.svelte.js';

export type DialogHandle<Payload = unknown> = PopupHandle<Payload>;

export type DialogModal = boolean | 'trap-focus';

export type DialogRefs = {
	trigger: HTMLElement | null;
	popup: HTMLElement | null;
};

export type DialogContext = {
	readonly open: boolean;
	setOpen(open: boolean, reason: OpenChangeReason): void;
	readonly modal: DialogModal;
	readonly disablePointerDismissal: boolean;
	readonly triggerId: string;
	readonly titleId: string;
	readonly descriptionId: string;
	readonly popupId: string;
	readonly refs: DialogRefs;
	readonly presence: ReturnType<typeof createPresence>;
	readonly payload: unknown;
};

export type DialogRootProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	open?: boolean | undefined;
	defaultOpen?: boolean;
	onOpenChange?: ((open: boolean, eventDetails: { reason: OpenChangeReason }) => void) | undefined;
	/**
	 * Whether the dialog enters a modal state when open.
	 * - `true`: focus trap, `aria-modal`, document scroll locked, page interaction limited
	 * - `false`: no focus trap / aria-modal / scroll lock
	 * - `'trap-focus'`: focus trap without `aria-modal` or scroll lock
	 * @default true
	 */
	modal?: DialogModal;
	/** Prevents closing on outside presses (and backdrop click). @default false */
	disablePointerDismissal?: boolean;
	/** Called after open/close animations complete. */
	onOpenChangeComplete?: ((open: boolean) => void) | undefined;
	/** Imperative handle from {@link createHandle}. */
	handle?: DialogHandle | undefined;
	children?: Snippet<[{ open: boolean; payload: unknown }]>;
};

export type DialogTriggerProps = Omit<HTMLButtonAttributes, 'children' | 'disabled' | 'id'> & {
	render?: string;
	disabled?: boolean;
	id?: string | undefined;
	/** Same handle as Root — enables triggers outside the Root tree. */
	handle?: DialogHandle | undefined;
	/** Optional payload associated when opening via this trigger. */
	payload?: unknown;
	children?: Snippet;
};

export type DialogPortalProps = {
	container?: HTMLElement | string | null;
	keepMounted?: boolean;
	children?: Snippet;
};

export type DialogBackdropProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	/** Keep the backdrop mounted while closed (for exit animations). */
	forceRender?: boolean;
	children?: Snippet;
};

export type DialogViewportProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	children?: Snippet;
};

export type DialogPopupProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	initialFocus?: FocusTarget;
	finalFocus?: FocusTarget;
	children?: Snippet;
};

export type DialogTitleProps = Omit<HTMLAttributes<HTMLHeadingElement>, 'children'> & {
	children?: Snippet;
};

export type DialogDescriptionProps = Omit<HTMLAttributes<HTMLParagraphElement>, 'children'> & {
	children?: Snippet;
};

export type DialogCloseProps = Omit<HTMLButtonAttributes, 'children'> & {
	render?: string;
	children?: Snippet;
};
