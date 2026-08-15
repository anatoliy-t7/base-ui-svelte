import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
import type { OpenChangeReason } from '../internal/controllable.svelte.js';
import type { createPresence } from '../internal/presence.svelte.js';

export type AlertDialogRefs = {
	trigger: HTMLElement | null;
	popup: HTMLElement | null;
};

export type AlertDialogContext = {
	readonly open: boolean;
	setOpen(open: boolean, reason: OpenChangeReason): void;
	readonly triggerId: string;
	readonly titleId: string;
	readonly descriptionId: string;
	readonly popupId: string;
	readonly refs: AlertDialogRefs;
	readonly presence: ReturnType<typeof createPresence>;
};

export type AlertDialogRootProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	open?: boolean | undefined;
	defaultOpen?: boolean;
	onOpenChange?:
		| ((open: boolean, eventDetails: { reason: OpenChangeReason }) => void)
		| undefined;
	children?: Snippet<[{ open: boolean }]>;
};

export type AlertDialogTriggerProps = Omit<HTMLButtonAttributes, 'children' | 'disabled'> & {
	render?: string;
	disabled?: boolean;
	children?: Snippet;
};

export type AlertDialogPortalProps = {
	children?: Snippet;
};

export type AlertDialogBackdropProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	children?: Snippet;
};

export type AlertDialogViewportProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	children?: Snippet;
};

export type AlertDialogPopupProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
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
