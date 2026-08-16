import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes, HTMLLabelAttributes } from 'svelte/elements';
import type { OpenChangeReason } from '../internal/controllable.svelte.js';
import type { Align, Side } from '../internal/floating.svelte.js';
import type { createPresence } from '../internal/presence.svelte.js';

export type SelectValue = string | string[] | null;

export type SelectCollectionItem = {
	readonly value: string;
	readonly label: string;
};

export type SelectItemsProp = ReadonlyArray<{
	readonly value: string;
	readonly label?: string;
}>;

export type SelectItemEntry = {
	readonly id: string;
	readonly value: string;
	label: string;
	readonly element: HTMLElement;
};

export type SelectRefs = {
	trigger: HTMLElement | null;
	popup: HTMLElement | null;
	positioner: HTMLElement | null;
	list: HTMLElement | null;
	arrow: HTMLElement | null;
};

export type SelectContext = {
	readonly value: SelectValue;
	setValue(value: SelectValue, event: Event): void;
	readonly open: boolean;
	setOpen(open: boolean, reason: OpenChangeReason): void;
	registerItem(id: string, value: string, element: HTMLElement): () => void;
	setItemLabel(value: string, label: string): void;
	readonly highlighted: string | null;
	setHighlighted(value: string | null): void;
	readonly items: SelectItemEntry[];
	getVisibleItems(): SelectItemEntry[];
	getItemId(value: string): string;
	readonly triggerId: string;
	readonly listId: string;
	readonly labelId: string | undefined;
	setLabelId(id: string | undefined): void;
	readonly refs: SelectRefs;
	readonly presence: ReturnType<typeof createPresence>;
	readonly disabled: boolean;
	readonly name: string | undefined;
	readonly multiple: boolean;
	readonly modal: boolean;
	isSelected(value: string): boolean;
	getSelectedValues(): string[];
	getSelectedLabel(): string | null;
	getLabelForValue(value: string): string;
	readonly collectionItems: ReadonlyArray<SelectCollectionItem>;
	selectItem(value: string, event: Event): void;
};

export type SelectItemContext = {
	readonly value: string;
	readonly selected: boolean;
	readonly highlighted: boolean;
	readonly disabled: boolean;
	setLabel(label: string): void;
};

export type SelectGroupContext = {
	readonly labelId: string | undefined;
	setLabelId(id: string | undefined): void;
};

export type SelectRootProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	value?: SelectValue | undefined;
	defaultValue?: SelectValue;
	onValueChange?: ((value: SelectValue, event: Event) => void) | undefined;
	open?: boolean | undefined;
	defaultOpen?: boolean;
	onOpenChange?: ((open: boolean, eventDetails: { reason: OpenChangeReason }) => void) | undefined;
	disabled?: boolean;
	name?: string | undefined;
	multiple?: boolean;
	/**
	 * Whether the select enters a modal state when open.
	 * When `true`, document scroll is locked while open.
	 * @default true
	 */
	modal?: boolean;
	items?: SelectItemsProp | undefined;
	children?: Snippet<[{ value: SelectValue; open: boolean; disabled: boolean }]>;
};

export type SelectLabelProps = Omit<HTMLLabelAttributes, 'children'> & {
	children?: Snippet;
};

export type SelectTriggerProps = Omit<HTMLButtonAttributes, 'children' | 'disabled'> & {
	render?: string;
	disabled?: boolean;
	children?: Snippet;
};

export type SelectValueProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	placeholder?: string;
	children?: Snippet<[SelectValue]>;
};

export type SelectIconProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	children?: Snippet;
};

export type SelectPortalProps = {
	children?: Snippet;
};

export type SelectBackdropProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	children?: Snippet;
};

export type SelectPositionerProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	side?: Side;
	align?: Align;
	sideOffset?: number;
	children?: Snippet;
};

export type SelectPopupProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	children?: Snippet;
};

export type SelectArrowProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	children?: Snippet;
};

export type SelectListProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type SelectItemProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'value'> & {
	value: string;
	disabled?: boolean;
	children?: Snippet<[{ selected: boolean; highlighted: boolean; disabled: boolean }]>;
};

export type SelectItemTextProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	children?: Snippet;
};

export type SelectItemIndicatorProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	children?: Snippet;
};

export type SelectSeparatorProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

export type SelectGroupProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type SelectGroupLabelProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type SelectScrollUpArrowProps = Omit<HTMLButtonAttributes, 'children'> & {
	children?: Snippet;
};

export type SelectScrollDownArrowProps = Omit<HTMLButtonAttributes, 'children'> & {
	children?: Snippet;
};
