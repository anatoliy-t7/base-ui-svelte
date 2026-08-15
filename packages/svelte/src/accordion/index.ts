import Root from './accordion-root.svelte';
import Item from './accordion-item.svelte';
import Header from './accordion-header.svelte';
import Trigger from './accordion-trigger.svelte';
import Panel from './accordion-panel.svelte';

export const Accordion = {
	Root,
	Item,
	Header,
	Trigger,
	Panel
};

export type {
	AccordionRootProps,
	AccordionItemProps,
	AccordionHeaderProps,
	AccordionTriggerProps,
	AccordionPanelProps,
	AccordionContext,
	AccordionItemContext,
	AccordionOrientation,
	AccordionValue
} from './types.js';
