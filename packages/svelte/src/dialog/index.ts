import Root from './dialog-root.svelte';
import Trigger from './dialog-trigger.svelte';
import Portal from './dialog-portal.svelte';
import Backdrop from './dialog-backdrop.svelte';
import Viewport from './dialog-viewport.svelte';
import Popup from './dialog-popup.svelte';
import Title from './dialog-title.svelte';
import Description from './dialog-description.svelte';
import Close from './dialog-close.svelte';
import { createPopupHandle, PopupHandle } from '../internal/popup-handle.js';

export function createHandle<Payload = unknown>() {
	return createPopupHandle<Payload>();
}

export { PopupHandle as Handle };

export const Dialog = {
	Root,
	Trigger,
	Portal,
	Backdrop,
	Viewport,
	Popup,
	Title,
	Description,
	Close,
	createHandle,
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
	DialogContext,
	DialogModal,
	DialogHandle,
} from './types.js';
