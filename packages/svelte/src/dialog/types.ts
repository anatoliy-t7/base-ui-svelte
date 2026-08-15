import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
import type { OpenChangeReason } from '../internal/controllable.svelte.js';
import type { createPresence } from '../internal/presence.svelte.js';

export type DialogRefs = {
	trigger: HTMLElement | null;
	popup: HTMLElement | null;
};

export type DialogContext = {
	readonly open: boolean;
	setOpen(open: boolean, reason: OpenChangeReason): void;
	readonly triggerId: string;
	readonly titleId: string;
	readonly descriptionId: string;
	readonly popupId: string;
	readonly refs: DialogRefs;
	readonly presence: ReturnType<typeof createPresence>;
};

export type DialogRootProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	open?: boolean | undefined;
	defaultOpen?: boolean;
	onOpenChange?:
		| ((open: boolean, eventDetails: { reason: OpenChangeReason }) => void)
		| undefined;
	children?: Snippet<[{ open: boolean }]>;
};

export type DialogTriggerProps = Omit<HTMLButtonAttributes, 'children' | 'disabled'> & {
	render?: string;
	disabled?: boolean;
	children?: Snippet;
};

export type DialogPortalProps = {
	children?: Snippet;
};

export type DialogBackdropProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	children?: Snippet;
};

export type DialogViewportProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	children?: Snippet;
};

export type DialogPopupProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
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
