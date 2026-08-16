/** Homepage copy shared by the quick-start page and JSON-LD (keep in sync with +page.md). */

export type FaqItem = {
	readonly question: string;
	readonly answer: string;
};

/** Meta description / lead — ~155 chars, answer-first. */
export const HOME_DESCRIPTION =
	'base-ui-svelte is an unofficial Svelte 5 port of Base UI: unstyled, accessible headless components. Use class, snippets, and bind: — not affiliated with MUI.';

export const HOME_FAQS: readonly FaqItem[] = [
	{
		question: 'What is base-ui-svelte?',
		answer:
			'base-ui-svelte is an unofficial Svelte 5 port of Base UI. It ships unstyled, accessible compound components that mirror Base UI part names, props, and data attributes, adapted for Svelte runes, snippets, and bind:. It is not affiliated with MUI or the Base UI team.'
	},
	{
		question: 'How do I install base-ui-svelte?',
		answer:
			'Install the package with your package manager (for example npm i base-ui-svelte). Peer dependency is Svelte 5. Import components from subpaths such as base-ui-svelte/popover, then style with class and data-* hooks. Optional visuals live in @base-ui-svelte/styles.'
	},
	{
		question: 'Is base-ui-svelte the same as Base UI for React?',
		answer:
			'APIs and accessibility behavior aim to match Base UI React, but the package is base-ui-svelte (not @base-ui/react). Use class instead of className, Svelte snippets instead of React children, and bind: for controlled state. See the Differences handbook page for deliberate Svelte divergences.'
	},
	{
		question: 'Is base-ui-svelte free?',
		answer:
			'Yes. base-ui-svelte is open source under the MIT license. There is no paid tier; install from npm and use it in personal or commercial Svelte projects.'
	},
	{
		question: 'Does base-ui-svelte include styles?',
		answer:
			'The core library is headless and unstyled. You style with your own CSS using data-* attributes. An optional @base-ui-svelte/styles package provides Tailwind CSS v4 recipes if you want starter visuals.'
	}
];
