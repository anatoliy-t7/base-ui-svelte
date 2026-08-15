import Root from './popover-root.svelte';
import Trigger from './popover-trigger.svelte';
import Portal from './popover-portal.svelte';
import Positioner from './popover-positioner.svelte';
import Popup from './popover-popup.svelte';
import Arrow from './popover-arrow.svelte';
import Title from './popover-title.svelte';
import Description from './popover-description.svelte';
import Close from './popover-close.svelte';

export const Popover = {
	Root,
	Trigger,
	Portal,
	Positioner,
	Popup,
	Arrow,
	Title,
	Description,
	Close
};

export type {
	PopoverRootProps,
	PopoverTriggerProps,
	PopoverPortalProps,
	PopoverPositionerProps,
	PopoverPopupProps,
	PopoverArrowProps,
	PopoverTitleProps,
	PopoverDescriptionProps,
	PopoverCloseProps,
	PopoverContext
} from './types.js';
