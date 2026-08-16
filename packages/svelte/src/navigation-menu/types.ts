import type { Snippet } from 'svelte';
import type { HTMLAnchorAttributes, HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
import type { Align, Side } from '../internal/floating.svelte.js';
import type { createPresence } from '../internal/presence.svelte.js';

export type NavigationMenuOrientation = 'horizontal' | 'vertical';

export type NavigationMenuRefs = {
	list: HTMLElement | null;
	popup: HTMLElement | null;
	positioner: HTMLElement | null;
	arrow: HTMLElement | null;
	triggers: Map<string, HTMLElement>;
};

export type NavigationMenuContext = {
	readonly value: string | null;
	setValue(value: string | null): void;
	readonly orientation: NavigationMenuOrientation;
	readonly open: boolean;
	readonly presence: ReturnType<typeof createPresence>;
	readonly refs: NavigationMenuRefs;
	readonly rootId: string;
	readonly popupId: string;
	registerContent(itemValue: string, content: Snippet): () => void;
	getContent(itemValue: string): Snippet | undefined;
	registerTrigger(itemValue: string, element: HTMLElement): () => void;
	openItem(itemValue: string): void;
	close(): void;
	readonly openDelay: number;
	readonly closeDelay: number;
	openWithDelay(itemValue: string): void;
	closeWithDelay(): void;
	cancelClose(): void;
};

export type NavigationMenuItemContext = {
	readonly value: string;
	readonly open: boolean;
	readonly triggerId: string;
	readonly contentId: string;
};

export type NavigationMenuRootProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
	value?: string | null | undefined;
	defaultValue?: string | null;
	onValueChange?: ((value: string | null) => void) | undefined;
	orientation?: NavigationMenuOrientation;
	delay?: number;
	closeDelay?: number;
	children?: Snippet<[{ value: string | null; open: boolean }]>;
};

export type NavigationMenuListProps = Omit<HTMLAttributes<HTMLUListElement>, 'children'> & {
	children?: Snippet;
};

export type NavigationMenuItemProps = Omit<HTMLAttributes<HTMLLIElement>, 'children' | 'value'> & {
	value: string;
	children?: Snippet<[{ open: boolean }]>;
};

export type NavigationMenuTriggerProps = Omit<HTMLButtonAttributes, 'children' | 'disabled'> & {
	disabled?: boolean;
	children?: Snippet;
};

export type NavigationMenuIconProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	children?: Snippet;
};

export type NavigationMenuContentProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type NavigationMenuLinkProps = Omit<HTMLAnchorAttributes, 'children'> & {
	children?: Snippet;
};

export type NavigationMenuPortalProps = {
	children?: Snippet;
};

export type NavigationMenuBackdropProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	children?: Snippet;
};

export type NavigationMenuPositionerProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	side?: Side;
	align?: Align;
	sideOffset?: number;
	children?: Snippet;
};

export type NavigationMenuPopupProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type NavigationMenuArrowProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	children?: Snippet;
};

export type NavigationMenuViewportProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};
