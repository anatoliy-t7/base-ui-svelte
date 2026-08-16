import Root from './popover-root.svelte';
import Trigger from './popover-trigger.svelte';
import Portal from './popover-portal.svelte';
import Backdrop from './popover-backdrop.svelte';
import Positioner from './popover-positioner.svelte';
import Popup from './popover-popup.svelte';
import Arrow from './popover-arrow.svelte';
import Title from './popover-title.svelte';
import Description from './popover-description.svelte';
import Close from './popover-close.svelte';
import Viewport from './popover-viewport.svelte';
import { createPopupHandle, PopupHandle } from '../internal/popup-handle.js';

export function createHandle<Payload = unknown>() {
	return createPopupHandle<Payload>();
}

export { PopupHandle as Handle };

export const Popover = {
	Root,
	Trigger,
	Portal,
	Backdrop,
	Positioner,
	Popup,
	Arrow,
	Title,
	Description,
	Close,
	Viewport,
	createHandle,
};

export type {
	PopoverRootProps,
	PopoverTriggerProps,
	PopoverPortalProps,
	PopoverBackdropProps,
	PopoverPositionerProps,
	PopoverPopupProps,
	PopoverArrowProps,
	PopoverTitleProps,
	PopoverDescriptionProps,
	PopoverCloseProps,
	PopoverViewportProps,
	PopoverContext,
	PopoverHandle,
	PopoverModal,
} from './types.js';
