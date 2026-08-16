/**
 * Regenerate component docs: preview + API reference (matches button page).
 */
import { readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const routes = join(import.meta.dir, '../src/routes');
const skip = new Set(['overview', 'handbook', 'utils']);

const titles: Record<string, string> = {
	'alert-dialog': 'Alert Dialog',
	'checkbox-group': 'Checkbox Group',
	'context-menu': 'Context Menu',
	'navigation-menu': 'Navigation Menu',
	'number-field': 'Number Field',
	'otp-field': 'OTP Field',
	'preview-card': 'Preview Card',
	'scroll-area': 'Scroll Area'
};

const descriptions: Record<string, string> = {
	accordion:
		'A vertically stacked set of interactive headings that each reveal a section of content.',
	'alert-dialog':
		'A modal dialog that interrupts the user with important content and expects a response.',
	autocomplete: 'An input that suggests values as the user types.',
	avatar: 'An image element with a fallback for representing the user.',
	button: 'A clickable button that supports native and polymorphic rendering.',
	checkbox: 'A control that allows the user to toggle between checked and not checked.',
	'checkbox-group': 'A set of checkboxes for selecting multiple options.',
	collapsible: 'An interactive component which expands/collapses a panel.',
	combobox: 'An input combined with a listbox of selectable options.',
	'context-menu':
		'Displays a menu located at the pointer, triggered by a right-click or long-press.',
	dialog: 'A window overlaid on the primary content for focused tasks.',
	drawer: 'A panel that slides in from the edge of the screen.',
	field: 'A form control with label, description, and validation messaging.',
	fieldset: 'A group of related form fields with a legend.',
	form: 'A form root that coordinates field validation and submit handling.',
	input: 'A text input control.',
	menu: 'A menu of actions or links triggered by a button.',
	menubar: 'A horizontal menu bar of menus.',
	meter: 'A graphical display of a numeric value within a range.',
	'navigation-menu': 'A collection of links for site navigation.',
	'number-field': 'An input for numeric values with increment and decrement controls.',
	'otp-field': 'A segmented input for one-time passcodes.',
	popover: 'Displays rich content in a portal, triggered by a button.',
	'preview-card': 'A popup that appears when a link or element is hovered or focused.',
	progress: 'Displays an indicator showing the completion progress of a task.',
	radio: 'A set of checkable buttons where only one can be checked at a time.',
	'scroll-area': 'Augments native scroll functionality for custom styling.',
	select: 'Displays a list of options for the user to pick from.',
	separator: 'Visually or semantically separates content.',
	slider: 'An input where the user selects a value from a range.',
	switch: 'A control that allows the user to toggle between checked and not checked.',
	tabs: 'A set of layered sections of content that display one panel at a time.',
	toast: 'A succinct message that is displayed temporarily.',
	toggle: 'A two-state button that can be either on or off.',
	toolbar: 'A container for grouping a set of controls.',
	tooltip: 'A popup that displays information related to an element when hovered or focused.'
};

function titleCase(slug: string): string {
	return (
		titles[slug] ??
		slug
			.split('-')
			.map((p) => p[0]!.toUpperCase() + p.slice(1))
			.join(' ')
	);
}

for (const name of readdirSync(routes)) {
	if (skip.has(name)) continue;
	const dir = join(routes, name);
	const demoPath = join(dir, 'demo.svelte');
	const pageMd = join(dir, '+page.md');
	if (!existsSync(demoPath)) continue;
	if (!existsSync(pageMd) && !existsSync(join(dir, '+page.svelte'))) continue;

	const title = titleCase(name);
	const description = descriptions[name] ?? `${title} component for base-ui-svelte.`;

	const md = `---
title: ${title}
description: ${JSON.stringify(description)}
---

<script>
	import ApiReference from '$lib/api/ApiReference.svelte';
	import ComponentPreview from '$lib/ComponentPreview.svelte';
	import Demo from './demo.svelte';
	import demoSource from './demo.svelte?raw';
</script>

<ComponentPreview code={demoSource}>

{#snippet preview()}
<Demo />
{/snippet}

</ComponentPreview>

## API Reference

<ApiReference slug="${name}" />
`;

	writeFileSync(pageMd, md);
	console.log('updated', name);
}
