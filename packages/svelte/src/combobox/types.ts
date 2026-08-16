import type { Snippet } from 'svelte';
import type {
	HTMLAttributes,
	HTMLButtonAttributes,
	HTMLInputAttributes,
	HTMLLabelAttributes,
} from 'svelte/elements';
import type { OpenChangeReason } from '../internal/controllable.svelte.js';
import type { Align, Side } from '../internal/floating.svelte.js';
import type { createPresence } from '../internal/presence.svelte.js';

export type ComboboxValue = string | string[] | null;

export type ComboboxCollectionItem = {
	readonly value: string;
	readonly label: string;
};

export type ComboboxItemsProp = ReadonlyArray<{
	readonly value: string;
	readonly label?: string;
}>;

export type ComboboxItemEntry = {
	readonly id: string;
	readonly value: string;
	label: string;
	readonly element: HTMLElement;
};

export type ComboboxRefs = {
	input: HTMLElement | null;
	trigger: HTMLElement | null;
	popup: HTMLElement | null;
	positioner: HTMLElement | null;
	list: HTMLElement | null;
	arrow: HTMLElement | null;
};

export type ComboboxContext = {
	readonly value: ComboboxValue;
	setValue(value: ComboboxValue, event: Event): void;
	readonly inputValue: string;
	setInputValue(value: string, event?: Event): void;
	clear(event: Event): void;
	readonly open: boolean;
	setOpen(open: boolean, reason: OpenChangeReason): void;
	registerItem(id: string, value: string, label: string, element: HTMLElement): () => void;
	readonly highlighted: string | null;
	setHighlighted(value: string | null): void;
	readonly items: ComboboxItemEntry[];
	getVisibleItems(): ComboboxItemEntry[];
	isItemVisible(value: string): boolean;
	getItemId(value: string): string;
	getSelectedLabel(): string | null;
	readonly inputId: string;
	readonly listId: string;
	readonly labelId: string | undefined;
	setLabelId(id: string | undefined): void;
	readonly refs: ComboboxRefs;
	readonly presence: ReturnType<typeof createPresence>;
	readonly disabled: boolean;
	readonly readOnly: boolean;
	readonly required: boolean;
	readonly name: string | undefined;
	readonly form: string | undefined;
	readonly filter: boolean;
	readonly multiple: boolean;
	readonly loopFocus: boolean;
	readonly modal: boolean;
	readonly openOnInputClick: boolean;
	isSelected(value: string): boolean;
	removeValue(value: string, event: Event): void;
	getSelectedValues(): string[];
	getLabelForValue(value: string): string;
	readonly collectionItems: ReadonlyArray<ComboboxCollectionItem>;
	selectItem(value: string, label: string, event: Event): void;
};

export type ComboboxItemContext = {
	readonly value: string;
	readonly selected: boolean;
	readonly highlighted: boolean;
	readonly disabled: boolean;
};

export type ComboboxChipContext = {
	readonly value: string;
};

export type ComboboxGroupContext = {
	readonly labelId: string | undefined;
	setLabelId(id: string | undefined): void;
};

export type ComboboxRootProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	value?: ComboboxValue | undefined;
	defaultValue?: ComboboxValue;
	onValueChange?: ((value: ComboboxValue, event: Event) => void) | undefined;
	inputValue?: string | undefined;
	defaultInputValue?: string;
	onInputChange?: ((value: string, event?: Event) => void) | undefined;
	open?: boolean | undefined;
	defaultOpen?: boolean;
	onOpenChange?: ((open: boolean, eventDetails: { reason: OpenChangeReason }) => void) | undefined;
	/** Called after open/close animations complete. */
	onOpenChangeComplete?: ((open: boolean) => void) | undefined;
	disabled?: boolean;
	readOnly?: boolean;
	required?: boolean;
	name?: string | undefined;
	form?: string | undefined;
	filter?: boolean;
	multiple?: boolean;
	/** Whether highlight wraps at list ends. @default true */
	loopFocus?: boolean;
	/** Whether the popup behaves as a modal layer. @default false */
	modal?: boolean;
	/** Open the popup when the input is clicked. @default true */
	openOnInputClick?: boolean;
	items?: ComboboxItemsProp | undefined;
	children?: Snippet<
		[{ value: ComboboxValue; inputValue: string; open: boolean; disabled: boolean }]
	>;
};

export type ComboboxLabelProps = Omit<HTMLLabelAttributes, 'children'> & {
	children?: Snippet;
};

export type ComboboxInputGroupProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type ComboboxInputProps = Omit<HTMLInputAttributes, 'children' | 'disabled' | 'value'> & {
	disabled?: boolean;
};

export type ComboboxTriggerProps = Omit<HTMLButtonAttributes, 'children' | 'disabled'> & {
	render?: string;
	disabled?: boolean;
	children?: Snippet;
};

export type ComboboxIconProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	children?: Snippet;
};

export type ComboboxClearProps = Omit<HTMLButtonAttributes, 'children' | 'disabled'> & {
	disabled?: boolean;
	children?: Snippet;
};

export type ComboboxValueProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	placeholder?: string;
	children?: Snippet<[ComboboxValue]>;
};

export type ComboboxPortalProps = {
	children?: Snippet;
};

export type ComboboxBackdropProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	children?: Snippet;
};

export type ComboboxPositionerProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	side?: Side;
	align?: Align;
	sideOffset?: number;
	children?: Snippet;
};

export type ComboboxPopupProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	render?: string;
	children?: Snippet;
};

export type ComboboxArrowProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	children?: Snippet;
};

export type ComboboxListProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type ComboboxStatusProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type ComboboxItemProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'value'> & {
	value: string;
	label?: string;
	disabled?: boolean;
	children?: Snippet<[{ selected: boolean; highlighted: boolean; disabled: boolean }]>;
};

export type ComboboxItemIndicatorProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	children?: Snippet;
};

export type ComboboxEmptyProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type ComboboxSeparatorProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

export type ComboboxGroupProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type ComboboxGroupLabelProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type ComboboxRowProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type ComboboxChipsProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: Snippet;
};

export type ComboboxChipProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'value'> & {
	value: string;
	children?: Snippet;
};

export type ComboboxChipRemoveProps = Omit<HTMLButtonAttributes, 'children' | 'disabled'> & {
	disabled?: boolean;
	children?: Snippet;
};

export type ComboboxCollectionProps = {
	children?: Snippet<[ComboboxCollectionItem]>;
};
