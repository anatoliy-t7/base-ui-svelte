import type { Snippet } from 'svelte';
import type { HTMLAnchorAttributes, HTMLAttributes } from 'svelte/elements';
import type { OpenChangeReason } from '../internal/controllable.svelte.js';
import type { Align, Side } from '../internal/floating.svelte.js';
import type { createPresence } from '../internal/presence.svelte.js';

export type ContextMenuAnchorPoint = {
	x: number;
	y: number;
};

export type ContextMenuRefs = {
	trigger: HTMLElement | null;
	popup: HTMLElement | null;
	positioner: HTMLElement | null;
	arrow: HTMLElement | null;
};

export type ContextMenuItemEntry = {
	id: string;
	element: HTMLElement;
	disabled: boolean;
};

export type ContextMenuSubmenuEntry = {
	id: string;
	triggerId: string;
	setOpen: (open: boolean, reason: OpenChangeReason) => void;
	getOpen: () => boolean;
};

export type ContextMenuContext = {
	readonly open: boolean;
	setOpen(open: boolean, reason: OpenChangeReason): void;
	readonly menuId: string;
	readonly triggerId: string;
	readonly popupId: string;
	readonly refs: ContextMenuRefs;
	readonly presence: ReturnType<typeof createPresence>;
	readonly anchorPoint: ContextMenuAnchorPoint | null;
	setAnchorPoint(point: ContextMenuAnchorPoint | null): void;
	readonly highlightedId: string | null;
	setHighlighted(id: string | null): void;
	registerItem(id: string, element: HTMLElement, disabled: boolean): () => void;
	getItems(): ContextMenuItemEntry[];
	highlightNext(): void;
	highlightPrevious(): void;
	highlightFirst(): void;
	highlightLast(): void;
	activateHighlighted(): void;
	readonly isSubmenu: boolean;
	readonly parentMenu: ContextMenuContext | null;
	registerSubmenu(entry: ContextMenuSubmenuEntry): () => void;
	closeSubmenus(exceptId?: string): void;
};

export type ContextMenuGroupContext = {
	readonly labelId: string | undefined;
	setLabelId(id: string | undefined): void;
};

export type ContextMenuCheckboxItemContext = {
	readonly checked: boolean;
	readonly disabled: boolean;
};

export type ContextMenuRadioGroupContext = {
	readonly value: string;
	readonly disabled: boolean;
	setValue(value: string, event: Event): void;
};

export type ContextMenuRadioItemContext = {
	readonly checked: boolean;
	readonly disabled: boolean;
};

export type ContextMenuRootProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	open?: boolean | undefined;
	defaultOpen?: boolean;
	onOpenChange?: ((open: boolean, eventDetails: { reason: OpenChangeReason }) => void) | undefined;
	children?: Snippet<[{ open: boolean }]>;
};

export type ContextMenuTriggerProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	disabled?: boolean;
	children?: Snippet;
};

export type ContextMenuPortalProps = {
	children?: Snippet;
};

export type ContextMenuBackdropProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	dismissible?: boolean;
	children?: Snippet;
};

export type ContextMenuPositionerProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	side?: Side;
	align?: Align;
	sideOffset?: number;
	children?: Snippet;
};

export type ContextMenuPopupProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	children?: Snippet;
};

export type ContextMenuArrowProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	children?: Snippet;
};

export type ContextMenuViewportProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type ContextMenuItemProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'disabled'> & {
	disabled?: boolean;
	onClick?: ((event: MouseEvent) => void) | undefined;
	children?: Snippet;
};

export type ContextMenuLinkItemProps = Omit<HTMLAnchorAttributes, 'children' | 'disabled'> & {
	disabled?: boolean;
	children?: Snippet;
};

export type ContextMenuSubmenuRootProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	open?: boolean | undefined;
	defaultOpen?: boolean;
	onOpenChange?: ((open: boolean, eventDetails: { reason: OpenChangeReason }) => void) | undefined;
	children?: Snippet<[{ open: boolean }]>;
};

export type ContextMenuSubmenuTriggerProps = Omit<
	HTMLAttributes<HTMLDivElement>,
	'children' | 'disabled'
> & {
	disabled?: boolean;
	children?: Snippet;
};

export type ContextMenuCheckboxItemProps = Omit<
	HTMLAttributes<HTMLDivElement>,
	'children' | 'disabled'
> & {
	checked?: boolean | undefined;
	defaultChecked?: boolean;
	onCheckedChange?: ((checked: boolean, event: Event) => void) | undefined;
	disabled?: boolean;
	children?: Snippet<[{ checked: boolean }]>;
};

export type ContextMenuCheckboxItemIndicatorProps = Omit<
	HTMLAttributes<HTMLSpanElement>,
	'children'
> & {
	children?: Snippet;
};

export type ContextMenuRadioGroupProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	value?: string | undefined;
	defaultValue?: string;
	onValueChange?: ((value: string, event: Event) => void) | undefined;
	disabled?: boolean;
	children?: Snippet<[{ value: string }]>;
};

export type ContextMenuRadioItemProps = Omit<
	HTMLAttributes<HTMLDivElement>,
	'children' | 'disabled'
> & {
	value: string;
	disabled?: boolean;
	children?: Snippet<[{ checked: boolean }]>;
};

export type ContextMenuRadioItemIndicatorProps = Omit<
	HTMLAttributes<HTMLSpanElement>,
	'children'
> & {
	children?: Snippet;
};

export type ContextMenuSeparatorProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

export type ContextMenuGroupProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type ContextMenuGroupLabelProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};
