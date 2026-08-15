import Provider from './drawer-provider.svelte';
import IndentBackground from './drawer-indent-background.svelte';
import Indent from './drawer-indent.svelte';
import Root from './drawer-root.svelte';
import Trigger from './drawer-trigger.svelte';
import SwipeArea from './drawer-swipe-area.svelte';
import Portal from './drawer-portal.svelte';
import Backdrop from './drawer-backdrop.svelte';
import Viewport from './drawer-viewport.svelte';
import Popup from './drawer-popup.svelte';
import Content from './drawer-content.svelte';
import Title from './drawer-title.svelte';
import Description from './drawer-description.svelte';
import Close from './drawer-close.svelte';

export const Drawer = {
	Provider,
	IndentBackground,
	Indent,
	Root,
	Trigger,
	SwipeArea,
	Portal,
	Backdrop,
	Viewport,
	Popup,
	Content,
	Title,
	Description,
	Close
};

export type {
	DrawerSwipeDirection,
	DrawerRootProps,
	DrawerTriggerProps,
	DrawerPortalProps,
	DrawerBackdropProps,
	DrawerViewportProps,
	DrawerPopupProps,
	DrawerContentProps,
	DrawerTitleProps,
	DrawerDescriptionProps,
	DrawerCloseProps,
	DrawerProviderProps,
	DrawerIndentProps,
	DrawerIndentBackgroundProps,
	DrawerSwipeAreaProps,
	DrawerContext,
	DrawerProviderContext
} from './types.js';
