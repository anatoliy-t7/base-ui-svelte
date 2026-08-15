import type { Snippet } from 'svelte';
import type {
	HTMLAttributes,
	HTMLButtonAttributes,
	HTMLInputAttributes,
	HTMLLabelAttributes
} from 'svelte/elements';
import type { OpenChangeReason } from '../internal/controllable.svelte.js';
import type { Align, Side } from '../internal/floating.svelte.js';
import type { createPresence } from '../internal/presence.svelte.js';

export type AutocompleteItemEntry = {
	readonly id: string;
	readonly value: string;
	label: string;
	readonly element: HTMLElement;
};

export type AutocompleteRefs = {
	input: HTMLElement | null;
	trigger: HTMLElement | null;
	popup: HTMLElement | null;
	positioner: HTMLElement | null;
	list: HTMLElement | null;
	arrow: HTMLElement | null;
};

export type AutocompleteContext = {
	readonly value: string | null;
	setValue(value: string | null, event: Event): void;
	readonly inputValue: string;
	setInputValue(value: string, event?: Event): void;
	clear(event: Event): void;
	readonly open: boolean;
	setOpen(open: boolean, reason: OpenChangeReason): void;
	registerItem(id: string, value: string, label: string, element: HTMLElement): () => void;
	readonly highlighted: string | null;
	setHighlighted(value: string | null): void;
	readonly items: AutocompleteItemEntry[];
	getVisibleItems(): AutocompleteItemEntry[];
	isItemVisible(value: string): boolean;
	getItemId(value: string): string;
	readonly inputId: string;
	readonly listId: string;
	readonly labelId: string | undefined;
	setLabelId(id: string | undefined): void;
	readonly refs: AutocompleteRefs;
	readonly presence: ReturnType<typeof createPresence>;
	readonly disabled: boolean;
	readonly filter: boolean;
	selectItem(value: string, label: string, event: Event): void;
};

export type AutocompleteItemContext = {
	readonly value: string;
	readonly selected: boolean;
	readonly highlighted: boolean;
	readonly disabled: boolean;
};

export type AutocompleteGroupContext = {
	readonly labelId: string | undefined;
	setLabelId(id: string | undefined): void;
};

export type AutocompleteRootProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	value?: string | null | undefined;
	defaultValue?: string | null;
	onValueChange?: ((value: string | null, event: Event) => void) | undefined;
	inputValue?: string | undefined;
	defaultInputValue?: string;
	onInputChange?: ((value: string, event?: Event) => void) | undefined;
	open?: boolean | undefined;
	defaultOpen?: boolean;
	onOpenChange?:
		| ((open: boolean, eventDetails: { reason: OpenChangeReason }) => void)
		| undefined;
	disabled?: boolean;
	filter?: boolean;
	children?: Snippet<
		[{ value: string | null; inputValue: string; open: boolean; disabled: boolean }]
	>;
};

export type AutocompleteLabelProps = Omit<HTMLLabelAttributes, 'children'> & {
	children?: Snippet;
};

export type AutocompleteInputGroupProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type AutocompleteInputProps = Omit<HTMLInputAttributes, 'children' | 'disabled' | 'value'> & {
	disabled?: boolean;
};

export type AutocompleteTriggerProps = Omit<HTMLButtonAttributes, 'children' | 'disabled'> & {
	render?: string;
	disabled?: boolean;
	children?: Snippet;
};

export type AutocompleteIconProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	children?: Snippet;
};

export type AutocompleteClearProps = Omit<HTMLButtonAttributes, 'children' | 'disabled'> & {
	disabled?: boolean;
	children?: Snippet;
};

export type AutocompletePortalProps = {
	children?: Snippet;
};

export type AutocompleteBackdropProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	children?: Snippet;
};

export type AutocompletePositionerProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	side?: Side;
	align?: Align;
	sideOffset?: number;
	children?: Snippet;
};

export type AutocompletePopupProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	children?: Snippet;
};

export type AutocompleteArrowProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	children?: Snippet;
};

export type AutocompleteListProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type AutocompleteStatusProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type AutocompleteItemProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'value'> & {
	value: string;
	label?: string;
	disabled?: boolean;
	children?: Snippet<[{ selected: boolean; highlighted: boolean; disabled: boolean }]>;
};

export type AutocompleteItemIndicatorProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	children?: Snippet;
};

export type AutocompleteEmptyProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type AutocompleteSeparatorProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

export type AutocompleteGroupProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type AutocompleteGroupLabelProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type AutocompleteRowProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};
