import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
import type { OpenChangeReason } from '../internal/controllable.svelte.js';
import type { Align, Side } from '../internal/floating.svelte.js';
import type { createPresence } from '../internal/presence.svelte.js';

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
	readonly triggerId: string;
	readonly titleId: string;
	readonly descriptionId: string;
	readonly popupId: string;
	readonly refs: PopoverRefs;
	readonly presence: ReturnType<typeof createPresence>;
};

export type PopoverRootProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	open?: boolean | undefined;
	defaultOpen?: boolean;
	onOpenChange?:
		| ((open: boolean, eventDetails: { reason: OpenChangeReason }) => void)
		| undefined;
	openOnHover?: boolean;
	/** Open delay when `openOnHover` is set (ms). @default 0 */
	delay?: number;
	/** Close delay when leaving under hover (ms). @default 0 */
	closeDelay?: number;
	children?: Snippet<[{ open: boolean }]>;
};

export type PopoverTriggerProps = Omit<HTMLButtonAttributes, 'children' | 'disabled'> & {
	render?: string;
	disabled?: boolean;
	openOnHover?: boolean;
	children?: Snippet;
};

export type PopoverPortalProps = {
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
