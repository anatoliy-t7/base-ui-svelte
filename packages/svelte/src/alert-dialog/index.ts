import Root from './alert-dialog-root.svelte';
import Trigger from './alert-dialog-trigger.svelte';
import Portal from './alert-dialog-portal.svelte';
import Backdrop from './alert-dialog-backdrop.svelte';
import Viewport from './alert-dialog-viewport.svelte';
import Popup from './alert-dialog-popup.svelte';
import Title from './alert-dialog-title.svelte';
import Description from './alert-dialog-description.svelte';
import Close from './alert-dialog-close.svelte';
import { createPopupHandle, PopupHandle } from '../internal/popup-handle.js';

export function createHandle<Payload = unknown>() {
	return createPopupHandle<Payload>();
}

export { PopupHandle as Handle };

export const AlertDialog = {
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
	AlertDialogRootProps,
	AlertDialogTriggerProps,
	AlertDialogPortalProps,
	AlertDialogBackdropProps,
	AlertDialogViewportProps,
	AlertDialogPopupProps,
	AlertDialogTitleProps,
	AlertDialogDescriptionProps,
	AlertDialogCloseProps,
	AlertDialogContext,
	AlertDialogModal,
	AlertDialogHandle,
} from './types.js';
