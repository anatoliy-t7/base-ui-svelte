import Root from './navigation-menu-root.svelte';
import List from './navigation-menu-list.svelte';
import Item from './navigation-menu-item.svelte';
import Trigger from './navigation-menu-trigger.svelte';
import Icon from './navigation-menu-icon.svelte';
import Content from './navigation-menu-content.svelte';
import Link from './navigation-menu-link.svelte';
import Portal from './navigation-menu-portal.svelte';
import Backdrop from './navigation-menu-backdrop.svelte';
import Positioner from './navigation-menu-positioner.svelte';
import Popup from './navigation-menu-popup.svelte';
import Arrow from './navigation-menu-arrow.svelte';
import Viewport from './navigation-menu-viewport.svelte';

export const NavigationMenu = {
	Root,
	List,
	Item,
	Trigger,
	Icon,
	Content,
	Link,
	Portal,
	Backdrop,
	Positioner,
	Popup,
	Arrow,
	Viewport
};

export type {
	NavigationMenuRootProps,
	NavigationMenuListProps,
	NavigationMenuItemProps,
	NavigationMenuTriggerProps,
	NavigationMenuIconProps,
	NavigationMenuContentProps,
	NavigationMenuLinkProps,
	NavigationMenuPortalProps,
	NavigationMenuBackdropProps,
	NavigationMenuPositionerProps,
	NavigationMenuPopupProps,
	NavigationMenuArrowProps,
	NavigationMenuViewportProps,
	NavigationMenuContext,
	NavigationMenuItemContext,
	NavigationMenuOrientation
} from './types.js';
