import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
import type { OpenChangeReason } from '../internal/controllable.svelte.js';
import type { createPresence } from '../internal/presence.svelte.js';

export type DrawerSwipeDirection = 'up' | 'down' | 'left' | 'right';

export type DrawerRefs = {
	trigger: HTMLElement | null;
	popup: HTMLElement | null;
};

export type DrawerContext = {
	readonly open: boolean;
	setOpen(open: boolean, reason: OpenChangeReason): void;
	readonly swipeDirection: DrawerSwipeDirection;
	readonly modal: boolean;
	readonly disablePointerDismissal: boolean;
	readonly triggerId: string;
	readonly titleId: string;
	readonly descriptionId: string;
	readonly popupId: string;
	readonly refs: DrawerRefs;
	readonly presence: ReturnType<typeof createPresence>;
};

export type DrawerRootProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	open?: boolean | undefined;
	defaultOpen?: boolean;
	onOpenChange?:
		| ((open: boolean, eventDetails: { reason: OpenChangeReason }) => void)
		| undefined;
	swipeDirection?: DrawerSwipeDirection;
	modal?: boolean;
	disablePointerDismissal?: boolean;
	children?: Snippet<[{ open: boolean }]>;
};

export type DrawerTriggerProps = Omit<HTMLButtonAttributes, 'children' | 'disabled'> & {
	render?: string;
	disabled?: boolean;
	children?: Snippet;
};

export type DrawerPortalProps = {
	children?: Snippet;
};

export type DrawerBackdropProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	children?: Snippet;
};

export type DrawerViewportProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	children?: Snippet;
};

export type DrawerPopupProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	children?: Snippet;
};

export type DrawerContentProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	children?: Snippet;
};

export type DrawerTitleProps = Omit<HTMLAttributes<HTMLHeadingElement>, 'children'> & {
	children?: Snippet;
};

export type DrawerDescriptionProps = Omit<HTMLAttributes<HTMLParagraphElement>, 'children'> & {
	children?: Snippet;
};

export type DrawerCloseProps = Omit<HTMLButtonAttributes, 'children'> & {
	render?: string;
	children?: Snippet;
};

export type DrawerProviderContext = {
	readonly openCount: number;
	readonly swipeDirection: DrawerSwipeDirection;
	registerOpen: () => () => void;
};

export type DrawerProviderProps = {
	swipeDirection?: DrawerSwipeDirection;
	children?: Snippet;
};

export type DrawerIndentProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	children?: Snippet;
};

export type DrawerIndentBackgroundProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	children?: Snippet;
};

export type DrawerSwipeAreaProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	disabled?: boolean;
	swipeDirection?: DrawerSwipeDirection;
	children?: Snippet;
};
