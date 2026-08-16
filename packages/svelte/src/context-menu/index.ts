import Root from './context-menu-root.svelte';
import Trigger from './context-menu-trigger.svelte';
import Portal from './context-menu-portal.svelte';
import Backdrop from './context-menu-backdrop.svelte';
import Positioner from './context-menu-positioner.svelte';
import Popup from './context-menu-popup.svelte';
import Arrow from './context-menu-arrow.svelte';
import Viewport from './context-menu-viewport.svelte';
import Item from './context-menu-item.svelte';
import LinkItem from './context-menu-link-item.svelte';
import SubmenuRoot from './context-menu-submenu-root.svelte';
import SubmenuTrigger from './context-menu-submenu-trigger.svelte';
import CheckboxItem from './context-menu-checkbox-item.svelte';
import CheckboxItemIndicator from './context-menu-checkbox-item-indicator.svelte';
import RadioGroup from './context-menu-radio-group.svelte';
import RadioItem from './context-menu-radio-item.svelte';
import RadioItemIndicator from './context-menu-radio-item-indicator.svelte';
import Separator from './context-menu-separator.svelte';
import Group from './context-menu-group.svelte';
import GroupLabel from './context-menu-group-label.svelte';

export const ContextMenu = {
	Root,
	Trigger,
	Portal,
	Backdrop,
	Positioner,
	Popup,
	Arrow,
	Viewport,
	Item,
	LinkItem,
	SubmenuRoot,
	SubmenuTrigger,
	CheckboxItem,
	CheckboxItemIndicator,
	RadioGroup,
	RadioItem,
	RadioItemIndicator,
	Separator,
	Group,
	GroupLabel,
};

export type {
	ContextMenuRootProps,
	ContextMenuTriggerProps,
	ContextMenuPortalProps,
	ContextMenuBackdropProps,
	ContextMenuPositionerProps,
	ContextMenuPopupProps,
	ContextMenuArrowProps,
	ContextMenuViewportProps,
	ContextMenuItemProps,
	ContextMenuLinkItemProps,
	ContextMenuSubmenuRootProps,
	ContextMenuSubmenuTriggerProps,
	ContextMenuCheckboxItemProps,
	ContextMenuCheckboxItemIndicatorProps,
	ContextMenuRadioGroupProps,
	ContextMenuRadioItemProps,
	ContextMenuRadioItemIndicatorProps,
	ContextMenuSeparatorProps,
	ContextMenuGroupProps,
	ContextMenuGroupLabelProps,
	ContextMenuContext,
} from './types.js';
