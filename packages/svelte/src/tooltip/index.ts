import Provider from './tooltip-provider.svelte';
import Root from './tooltip-root.svelte';
import Trigger from './tooltip-trigger.svelte';
import Portal from './tooltip-portal.svelte';
import Positioner from './tooltip-positioner.svelte';
import Popup from './tooltip-popup.svelte';
import Arrow from './tooltip-arrow.svelte';
import Viewport from './tooltip-viewport.svelte';
import { createPopupHandle, PopupHandle } from '../internal/popup-handle.js';

export function createHandle<Payload = unknown>() {
	return createPopupHandle<Payload>();
}

export { PopupHandle as Handle };

export const Tooltip = {
	Provider,
	Root,
	Trigger,
	Portal,
	Positioner,
	Popup,
	Arrow,
	Viewport,
	createHandle,
};

export type {
	TooltipProviderProps,
	TooltipRootProps,
	TooltipTriggerProps,
	TooltipPortalProps,
	TooltipPositionerProps,
	TooltipPopupProps,
	TooltipArrowProps,
	TooltipViewportProps,
	TooltipContext,
	TooltipProviderContext,
	TooltipHandle,
} from './types.js';
