import Root from './preview-card-root.svelte';
import Trigger from './preview-card-trigger.svelte';
import Portal from './preview-card-portal.svelte';
import Backdrop from './preview-card-backdrop.svelte';
import Positioner from './preview-card-positioner.svelte';
import Popup from './preview-card-popup.svelte';
import Arrow from './preview-card-arrow.svelte';
import Viewport from './preview-card-viewport.svelte';
import { createPopupHandle, PopupHandle } from '../internal/popup-handle.js';

export function createHandle<Payload = unknown>() {
	return createPopupHandle<Payload>();
}

export { PopupHandle as Handle };

export const PreviewCard = {
	Root,
	Trigger,
	Portal,
	Backdrop,
	Positioner,
	Popup,
	Arrow,
	Viewport,
	createHandle,
};

export type {
	PreviewCardRootProps,
	PreviewCardTriggerProps,
	PreviewCardPortalProps,
	PreviewCardBackdropProps,
	PreviewCardPositionerProps,
	PreviewCardPopupProps,
	PreviewCardArrowProps,
	PreviewCardViewportProps,
	PreviewCardContext,
	PreviewCardHandle,
} from './types.js';
