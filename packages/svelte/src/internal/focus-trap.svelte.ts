const FOCUSABLE =
	'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export type FocusTrapOptions = {
	readonly enabled: boolean;
	readonly container: () => HTMLElement | null | undefined;
	readonly restoreFocus?: boolean;
};

/**
 * Traps Tab focus inside a container while enabled; restores focus on cleanup.
 */
export function createFocusTrap(options: FocusTrapOptions) {
	let previouslyFocused: HTMLElement | null = null;

	$effect(() => {
		if (!options.enabled) return;

		const container = options.container();
		if (!container) return;

		previouslyFocused =
			document.activeElement instanceof HTMLElement ? document.activeElement : null;

		const focusables = () =>
			Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
				(el) => !el.hasAttribute('disabled') && el.tabIndex !== -1
			);

		const items = focusables();
		if (items[0]) {
			items[0].focus();
		} else {
			container.setAttribute('tabindex', '-1');
			container.focus();
		}

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key !== 'Tab') return;
			const list = focusables();
			if (list.length === 0) {
				event.preventDefault();
				return;
			}
			const first = list[0];
			const last = list[list.length - 1];
			if (!first || !last) return;

			if (event.shiftKey) {
				if (document.activeElement === first) {
					event.preventDefault();
					last.focus();
				}
			} else if (document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		};

		container.addEventListener('keydown', onKeyDown);

		return () => {
			container.removeEventListener('keydown', onKeyDown);
			if (options.restoreFocus !== false && previouslyFocused) {
				previouslyFocused.focus();
			}
		};
	});
}
