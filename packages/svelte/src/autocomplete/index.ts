import Root from './autocomplete-root.svelte';
import Label from './autocomplete-label.svelte';
import InputGroup from './autocomplete-input-group.svelte';
import Input from './autocomplete-input.svelte';
import Trigger from './autocomplete-trigger.svelte';
import Icon from './autocomplete-icon.svelte';
import Clear from './autocomplete-clear.svelte';
import Portal from './autocomplete-portal.svelte';
import Backdrop from './autocomplete-backdrop.svelte';
import Positioner from './autocomplete-positioner.svelte';
import Popup from './autocomplete-popup.svelte';
import Arrow from './autocomplete-arrow.svelte';
import List from './autocomplete-list.svelte';
import Status from './autocomplete-status.svelte';
import Item from './autocomplete-item.svelte';
import ItemIndicator from './autocomplete-item-indicator.svelte';
import Empty from './autocomplete-empty.svelte';
import Separator from './autocomplete-separator.svelte';
import Group from './autocomplete-group.svelte';
import GroupLabel from './autocomplete-group-label.svelte';
import Row from './autocomplete-row.svelte';

export const Autocomplete = {
	Root,
	Label,
	InputGroup,
	Input,
	Trigger,
	Icon,
	Clear,
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
	Row
};

export type {
	AutocompleteRootProps,
	AutocompleteLabelProps,
	AutocompleteInputGroupProps,
	AutocompleteInputProps,
	AutocompleteTriggerProps,
	AutocompleteIconProps,
	AutocompleteClearProps,
	AutocompletePortalProps,
	AutocompleteBackdropProps,
	AutocompletePositionerProps,
	AutocompletePopupProps,
	AutocompleteArrowProps,
	AutocompleteListProps,
	AutocompleteStatusProps,
	AutocompleteItemProps,
	AutocompleteItemIndicatorProps,
	AutocompleteEmptyProps,
	AutocompleteSeparatorProps,
	AutocompleteGroupProps,
	AutocompleteGroupLabelProps,
	AutocompleteRowProps,
	AutocompleteContext,
	AutocompleteItemContext,
	AutocompleteGroupContext
} from './types.js';
