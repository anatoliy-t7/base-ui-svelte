import Root from './combobox-root.svelte';
import Label from './combobox-label.svelte';
import InputGroup from './combobox-input-group.svelte';
import Input from './combobox-input.svelte';
import Trigger from './combobox-trigger.svelte';
import Icon from './combobox-icon.svelte';
import Clear from './combobox-clear.svelte';
import Value from './combobox-value.svelte';
import Chips from './combobox-chips.svelte';
import Chip from './combobox-chip.svelte';
import ChipRemove from './combobox-chip-remove.svelte';
import Portal from './combobox-portal.svelte';
import Backdrop from './combobox-backdrop.svelte';
import Positioner from './combobox-positioner.svelte';
import Popup from './combobox-popup.svelte';
import Arrow from './combobox-arrow.svelte';
import List from './combobox-list.svelte';
import Status from './combobox-status.svelte';
import Item from './combobox-item.svelte';
import ItemIndicator from './combobox-item-indicator.svelte';
import Empty from './combobox-empty.svelte';
import Separator from './combobox-separator.svelte';
import Group from './combobox-group.svelte';
import GroupLabel from './combobox-group-label.svelte';
import Row from './combobox-row.svelte';
import Collection from './combobox-collection.svelte';
import { useFilter } from '../internal/filter.js';

export { useFilter };

export const Combobox = {
	Root,
	Label,
	InputGroup,
	Input,
	Trigger,
	Icon,
	Clear,
	Value,
	Chips,
	Chip,
	ChipRemove,
	Portal,
	Backdrop,
	Positioner,
	Popup,
	Arrow,
	List,
	Status,
	Item,
	ItemIndicator,
	Empty,
	Separator,
	Group,
	GroupLabel,
	Row,
	Collection,
	useFilter,
};

export type {
	ComboboxRootProps,
	ComboboxLabelProps,
	ComboboxInputGroupProps,
	ComboboxInputProps,
	ComboboxTriggerProps,
	ComboboxIconProps,
	ComboboxClearProps,
	ComboboxValueProps,
	ComboboxChipsProps,
	ComboboxChipProps,
	ComboboxChipRemoveProps,
	ComboboxPortalProps,
	ComboboxBackdropProps,
	ComboboxPositionerProps,
	ComboboxPopupProps,
	ComboboxArrowProps,
	ComboboxListProps,
	ComboboxStatusProps,
	ComboboxItemProps,
	ComboboxItemIndicatorProps,
	ComboboxEmptyProps,
	ComboboxSeparatorProps,
	ComboboxGroupProps,
	ComboboxGroupLabelProps,
	ComboboxRowProps,
	ComboboxCollectionProps,
	ComboboxContext,
	ComboboxItemContext,
	ComboboxChipContext,
	ComboboxGroupContext,
	ComboboxValue,
	ComboboxCollectionItem,
	ComboboxItemsProp,
} from './types.js';
