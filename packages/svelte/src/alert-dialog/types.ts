import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
import type { OpenChangeReason } from '../internal/controllable.svelte.js';
import type { FocusTarget } from '../internal/focus-trap.svelte.js';
import type { PopupHandle } from '../internal/popup-handle.js';
import type { createPresence } from '../internal/presence.svelte.js';

export type AlertDialogHandle<Payload = unknown> = PopupHandle<Payload>;

export type AlertDialogModal = boolean | 'trap-focus';

export type AlertDialogRefs = {
	trigger: HTMLElement | null;
	popup: HTMLElement | null;
};

export type AlertDialogContext = {
	readonly open: boolean;
	setOpen(open: boolean, reason: OpenChangeReason): void;
	readonly modal: AlertDialogModal;
	readonly disablePointerDismissal: boolean;
	readonly triggerId: string;
	readonly titleId: string;
	readonly descriptionId: string;
	readonly popupId: string;
	readonly refs: AlertDialogRefs;
	readonly presence: ReturnType<typeof createPresence>;
	readonly payload: unknown;
};

export type AlertDialogRootProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	open?: boolean | undefined;
	defaultOpen?: boolean;
	onOpenChange?: ((open: boolean, eventDetails: { reason: OpenChangeReason }) => void) | undefined;
	/**
	 * @default true
	 */
	modal?: AlertDialogModal;
	/** @default false */
	disablePointerDismissal?: boolean;
	onOpenChangeComplete?: ((open: boolean) => void) | undefined;
	/** Imperative handle from {@link createHandle}. */
	handle?: AlertDialogHandle | undefined;
	children?: Snippet<[{ open: boolean; payload: unknown }]>;
};

export type AlertDialogTriggerProps = Omit<HTMLButtonAttributes, 'children' | 'disabled' | 'id'> & {
	render?: string;
	disabled?: boolean;
	id?: string | undefined;
	/** Same handle as Root — enables triggers outside the Root tree. */
	handle?: AlertDialogHandle | undefined;
	/** Optional payload associated when opening via this trigger. */
	payload?: unknown;
	children?: Snippet;
};

export type AlertDialogPortalProps = {
	container?: HTMLElement | string | null;
	keepMounted?: boolean;
	children?: Snippet;
};

export type AlertDialogBackdropProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	forceRender?: boolean;
	children?: Snippet;
};

export type AlertDialogViewportProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	children?: Snippet;
};

export type AlertDialogPopupProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	initialFocus?: FocusTarget;
	finalFocus?: FocusTarget;
	children?: Snippet;
};

export type AlertDialogTitleProps = Omit<HTMLAttributes<HTMLHeadingElement>, 'children'> & {
	children?: Snippet;
};

export type AlertDialogDescriptionProps = Omit<HTMLAttributes<HTMLParagraphElement>, 'children'> & {
	children?: Snippet;
};

export type AlertDialogCloseProps = Omit<HTMLButtonAttributes, 'children'> & {
	render?: string;
	children?: Snippet;
};
