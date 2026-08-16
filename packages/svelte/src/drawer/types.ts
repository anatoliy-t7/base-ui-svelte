import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
import type { OpenChangeReason } from '../internal/controllable.svelte.js';
import type { PopupHandle } from '../internal/popup-handle.js';
import type { createPresence } from '../internal/presence.svelte.js';

export type DrawerHandle<Payload = unknown> = PopupHandle<Payload>;

export type DrawerSwipeDirection = 'up' | 'down' | 'left' | 'right';

export type DrawerSnapPoint = number | string;

export type DrawerSwipeMode = 'open' | 'dismiss';

export type DrawerRefs = {
	trigger: HTMLElement | null;
	popup: HTMLElement | null;
};

export type DrawerSwipeVisual = {
	progress: number;
	movementX: number;
	movementY: number;
	strength: number;
};

export type DrawerContext = {
	readonly open: boolean;
	setOpen(open: boolean, reason: OpenChangeReason): void;
	readonly swipeDirection: DrawerSwipeDirection;
	readonly modal: boolean;
	readonly disablePointerDismissal: boolean;
	readonly snapPoints: ReadonlyArray<DrawerSnapPoint> | undefined;
	readonly activeSnapPointIndex: number;
	setActiveSnapPointIndex(index: number): void;
	readonly swipeProgress: number;
	readonly swipeMovementX: number;
	readonly swipeMovementY: number;
	readonly swipeStrength: number;
	readonly swiping: boolean;
	readonly swipeMode: DrawerSwipeMode | null;
	setSwipeVisual(visual: DrawerSwipeVisual | null): void;
	beginSwipe(pointerId: number, startX: number, startY: number, mode: DrawerSwipeMode): void;
	updateSwipe(clientX: number, clientY: number, timeStamp: number, size: number): void;
	endSwipe(size: number): void;
	cancelSwipe(): void;
	readonly triggerId: string;
	readonly titleId: string;
	readonly descriptionId: string;
	readonly popupId: string;
	readonly refs: DrawerRefs;
	readonly presence: ReturnType<typeof createPresence>;
	readonly payload: unknown;
};

export type DrawerRootProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	open?: boolean | undefined;
	defaultOpen?: boolean;
	onOpenChange?: ((open: boolean, eventDetails: { reason: OpenChangeReason }) => void) | undefined;
	swipeDirection?: DrawerSwipeDirection;
	/**
	 * Whether the drawer enters a modal state when open.
	 * When `true`, focus is trapped, document scroll is locked, and outside
	 * pointer interaction is limited.
	 * @default true
	 */
	modal?: boolean;
	disablePointerDismissal?: boolean;
	snapPoints?: ReadonlyArray<DrawerSnapPoint>;
	/** Imperative handle from {@link createHandle}. */
	handle?: DrawerHandle | undefined;
	children?: Snippet<[{ open: boolean; payload: unknown }]>;
};

export type DrawerTriggerProps = Omit<HTMLButtonAttributes, 'children' | 'disabled' | 'id'> & {
	render?: string;
	disabled?: boolean;
	id?: string | undefined;
	/** Same handle as Root — enables triggers outside the Root tree. */
	handle?: DrawerHandle | undefined;
	/** Optional payload associated when opening via this trigger. */
	payload?: unknown;
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

export type DrawerVirtualKeyboardContext = {
	readonly keyboardInset: number;
	readonly keyboardOpen: boolean;
};

export type DrawerVirtualKeyboardProviderProps = Omit<
	HTMLAttributes<HTMLDivElement>,
	'children'
> & {
	children?: Snippet;
};
