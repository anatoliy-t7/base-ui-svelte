export type NavLink = {
	readonly label: string;
	readonly href: string;
	readonly external?: boolean;
};

export type NavSection = {
	readonly title: string;
	readonly items: readonly NavLink[];
};

export const navSections: readonly NavSection[] = [
	{
		title: 'Overview',
		items: [
			{ label: 'Quick start', href: '/' },
			{ label: 'Accessibility', href: '/overview/accessibility' },
			{ label: 'Releases', href: '/overview/releases' },
			{ label: 'Community', href: '/overview/community' },
			{ label: 'About', href: '/overview/about' }
		]
	},
	{
		title: 'Handbook',
		items: [
			{ label: 'Differences', href: '/handbook/differences' },
			{ label: 'Styling', href: '/handbook/styling' },
			{ label: 'Animation', href: '/handbook/animation' },
			{ label: 'Composition', href: '/handbook/composition' },
			{ label: 'Customization', href: '/handbook/customization' },
			{ label: 'Forms', href: '/handbook/forms' },
			{ label: 'TypeScript', href: '/handbook/typescript' },
			{ label: 'llms.txt', href: '/llms.txt', external: true }
		]
	},
	{
		title: 'Components',
		items: [
			{ label: 'Accordion', href: '/accordion' },
			{ label: 'Alert Dialog', href: '/alert-dialog' },
			{ label: 'Autocomplete', href: '/autocomplete' },
			{ label: 'Avatar', href: '/avatar' },
			{ label: 'Button', href: '/button' },
			{ label: 'Checkbox', href: '/checkbox' },
			{ label: 'Checkbox Group', href: '/checkbox-group' },
			{ label: 'Collapsible', href: '/collapsible' },
			{ label: 'Combobox', href: '/combobox' },
			{ label: 'Context Menu', href: '/context-menu' },
			{ label: 'Dialog', href: '/dialog' },
			{ label: 'Drawer', href: '/drawer' },
			{ label: 'Field', href: '/field' },
			{ label: 'Fieldset', href: '/fieldset' },
			{ label: 'Form', href: '/form' },
			{ label: 'Input', href: '/input' },
			{ label: 'Menu', href: '/menu' },
			{ label: 'Menubar', href: '/menubar' },
			{ label: 'Meter', href: '/meter' },
			{ label: 'Navigation Menu', href: '/navigation-menu' },
			{ label: 'Number Field', href: '/number-field' },
			{ label: 'OTP Field', href: '/otp-field' },
			{ label: 'Popover', href: '/popover' },
			{ label: 'Preview Card', href: '/preview-card' },
			{ label: 'Progress', href: '/progress' },
			{ label: 'Radio', href: '/radio' },
			{ label: 'Scroll Area', href: '/scroll-area' },
			{ label: 'Select', href: '/select' },
			{ label: 'Separator', href: '/separator' },
			{ label: 'Slider', href: '/slider' },
			{ label: 'Switch', href: '/switch' },
			{ label: 'Tabs', href: '/tabs' },
			{ label: 'Toast', href: '/toast' },
			{ label: 'Toggle', href: '/toggle' },
			{ label: 'Toolbar', href: '/toolbar' },
			{ label: 'Tooltip', href: '/tooltip' }
		]
	},
	{
		title: 'Utils',
		items: [
			{ label: 'CSP Provider', href: '/utils/csp-provider' },
			{ label: 'Direction Provider', href: '/utils/direction-provider' },
			{ label: 'mergeProps', href: '/utils/merge-props' }
		]
	}
] as const;
