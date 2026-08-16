import Root from './select-root.svelte';
import Label from './select-label.svelte';
import Trigger from './select-trigger.svelte';
import Value from './select-value.svelte';
import Icon from './select-icon.svelte';
import Portal from './select-portal.svelte';
import Backdrop from './select-backdrop.svelte';
import Positioner from './select-positioner.svelte';
import Popup from './select-popup.svelte';
import Arrow from './select-arrow.svelte';
import List from './select-list.svelte';
import Item from './select-item.svelte';
import ItemText from './select-item-text.svelte';
import ItemIndicator from './select-item-indicator.svelte';
import Separator from './select-separator.svelte';
import Group from './select-group.svelte';
import GroupLabel from './select-group-label.svelte';
import ScrollUpArrow from './select-scroll-up-arrow.svelte';
import ScrollDownArrow from './select-scroll-down-arrow.svelte';

export const Select = {
	Root,
	Label,
	Trigger,
	Value,
	Icon,
	Portal,
	Backdrop,
	Positioner,
	Popup,
	Arrow,
	List,
	Item,
	ItemText,
	ItemIndicator,
	Separator,
	Group,
	GroupLabel,
	ScrollUpArrow,
	ScrollDownArrow,
};

export type {
	SelectRootProps,
	SelectLabelProps,
	SelectTriggerProps,
	SelectValueProps,
	SelectIconProps,
	SelectPortalProps,
	SelectBackdropProps,
	SelectPositionerProps,
	SelectPopupProps,
	SelectArrowProps,
	SelectListProps,
	SelectItemProps,
	SelectItemTextProps,
	SelectItemIndicatorProps,
	SelectSeparatorProps,
	SelectGroupProps,
	SelectGroupLabelProps,
	SelectScrollUpArrowProps,
	SelectScrollDownArrowProps,
	SelectContext,
	SelectItemContext,
	SelectGroupContext,
	SelectValue,
	SelectItemsProp,
	SelectCollectionItem,
} from './types.js';
