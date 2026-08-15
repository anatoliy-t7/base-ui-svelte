import type { Snippet } from 'svelte';
import type {
	HTMLAnchorAttributes,
	HTMLAttributes,
	HTMLButtonAttributes
} from 'svelte/elements';
import type { OpenChangeReason } from '../internal/controllable.svelte.js';
import type { Align, Side } from '../internal/floating.svelte.js';
import type { createPresence } from '../internal/presence.svelte.js';

export type MenuRefs = {
	trigger: HTMLElement | null;
	popup: HTMLElement | null;
	positioner: HTMLElement | null;
	arrow: HTMLElement | null;
};

export type MenuItemEntry = {
	id: string;
	element: HTMLElement;
	disabled: boolean;
};

export type MenuSubmenuEntry = {
	id: string;
	triggerId: string;
	setOpen: (open: boolean, reason: OpenChangeReason) => void;
	getOpen: () => boolean;
};

export type MenuContext = {
	readonly open: boolean;
	setOpen(open: boolean, reason: OpenChangeReason): void;
	readonly menuId: string;
	readonly triggerId: string;
	readonly popupId: string;
	readonly refs: MenuRefs;
	readonly presence: ReturnType<typeof createPresence>;
	readonly highlightedId: string | null;
	setHighlighted(id: string | null): void;
	registerItem(id: string, element: HTMLElement, disabled: boolean): () => void;
	getItems(): MenuItemEntry[];
	highlightNext(): void;
	highlightPrevious(): void;
	highlightFirst(): void;
	highlightLast(): void;
	activateHighlighted(): void;
	readonly isSubmenu: boolean;
	readonly parentMenu: MenuContext | null;
	registerSubmenu(entry: MenuSubmenuEntry): () => void;
	closeSubmenus(exceptId?: string): void;
};

export type MenuGroupContext = {
	readonly labelId: string | undefined;
	setLabelId(id: string | undefined): void;
};

export type MenuCheckboxItemContext = {
	readonly checked: boolean;
	readonly disabled: boolean;
};

export type MenuRadioGroupContext = {
	readonly value: string;
	readonly disabled: boolean;
	setValue(value: string, event: Event): void;
};

export type MenuRadioItemContext = {
	readonly checked: boolean;
	readonly disabled: boolean;
};

export type MenuRootProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	open?: boolean | undefined;
	defaultOpen?: boolean;
	onOpenChange?:
		| ((open: boolean, eventDetails: { reason: OpenChangeReason }) => void)
		| undefined;
	children?: Snippet<[{ open: boolean }]>;
};

export type MenuTriggerProps = Omit<HTMLButtonAttributes, 'children' | 'disabled'> & {
	render?: string;
	disabled?: boolean;
	openOnHover?: boolean;
	children?: Snippet;
};

export type MenuPortalProps = {
	children?: Snippet;
};

export type MenuBackdropProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	dismissible?: boolean;
	children?: Snippet;
};

export type MenuPositionerProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	side?: Side;
	align?: Align;
	sideOffset?: number;
	children?: Snippet;
};

export type MenuPopupProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	children?: Snippet;
};

export type MenuArrowProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	children?: Snippet;
};

export type MenuViewportProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type MenuItemProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'disabled'> & {
	disabled?: boolean;
	onClick?: ((event: MouseEvent) => void) | undefined;
	children?: Snippet;
};

export type MenuLinkItemProps = Omit<HTMLAnchorAttributes, 'children' | 'disabled'> & {
	disabled?: boolean;
	children?: Snippet;
};

export type MenuSubmenuRootProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	open?: boolean | undefined;
	defaultOpen?: boolean;
	onOpenChange?:
		| ((open: boolean, eventDetails: { reason: OpenChangeReason }) => void)
		| undefined;
	children?: Snippet<[{ open: boolean }]>;
};

export type MenuSubmenuTriggerProps = Omit<
	HTMLAttributes<HTMLDivElement>,
	'children' | 'disabled'
> & {
	disabled?: boolean;
	children?: Snippet;
};

export type MenuCheckboxItemProps = Omit<
	HTMLAttributes<HTMLDivElement>,
	'children' | 'disabled'
> & {
	checked?: boolean | undefined;
	defaultChecked?: boolean;
	onCheckedChange?: ((checked: boolean, event: Event) => void) | undefined;
	disabled?: boolean;
	children?: Snippet<[{ checked: boolean }]>;
};

export type MenuCheckboxItemIndicatorProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	children?: Snippet;
};

export type MenuRadioGroupProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	value?: string | undefined;
	defaultValue?: string;
	onValueChange?: ((value: string, event: Event) => void) | undefined;
	disabled?: boolean;
	children?: Snippet<[{ value: string }]>;
};

export type MenuRadioItemProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'disabled'> & {
	value: string;
	disabled?: boolean;
	children?: Snippet<[{ checked: boolean }]>;
};

export type MenuRadioItemIndicatorProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	children?: Snippet;
};

export type MenuSeparatorProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

export type MenuGroupProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type MenuGroupLabelProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};
