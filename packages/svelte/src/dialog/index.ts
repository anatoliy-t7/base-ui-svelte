import Root from './dialog-root.svelte';
import Trigger from './dialog-trigger.svelte';
import Portal from './dialog-portal.svelte';
import Backdrop from './dialog-backdrop.svelte';
import Viewport from './dialog-viewport.svelte';
import Popup from './dialog-popup.svelte';
import Title from './dialog-title.svelte';
import Description from './dialog-description.svelte';
import Close from './dialog-close.svelte';

export const Dialog = {
	Root,
	Trigger,
	Portal,
	Backdrop,
	Viewport,
	Popup,
	Title,
	Description,
	Close
};

export type {
	DialogRootProps,
	DialogTriggerProps,
	DialogPortalProps,
	DialogBackdropProps,
	DialogViewportProps,
	DialogPopupProps,
	DialogTitleProps,
	DialogDescriptionProps,
	DialogCloseProps,
	DialogContext
} from './types.js';
