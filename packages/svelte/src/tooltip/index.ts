import Root from './tooltip-root.svelte';
import Trigger from './tooltip-trigger.svelte';
import Portal from './tooltip-portal.svelte';
import Positioner from './tooltip-positioner.svelte';
import Popup from './tooltip-popup.svelte';
import Arrow from './tooltip-arrow.svelte';

export const Tooltip = {
	Root,
	Trigger,
	Portal,
	Positioner,
	Popup,
	Arrow
};

export type {
	TooltipRootProps,
	TooltipTriggerProps,
	TooltipPortalProps,
	TooltipPositionerProps,
	TooltipPopupProps,
	TooltipArrowProps,
	TooltipContext
} from './types.js';
