const FOCUSABLE =
	'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export type FocusTarget =
	| boolean
	| HTMLElement
	| null
	| undefined
	| (() => boolean | HTMLElement | null | undefined);

export type FocusTrapOptions = {
	readonly enabled: boolean;
	readonly container: () => HTMLElement | null | undefined;
	readonly restoreFocus?: boolean;
	/** Element to focus when the trap activates. `false` skips autofocus. @default true */
	readonly initialFocus?: FocusTarget;
	/** Element to focus when the trap deactivates. Overrides restore-to-previous when set. */
	readonly finalFocus?: FocusTarget;
};

function resolveFocusTarget(
	target: FocusTarget | undefined,
	fallback: () => HTMLElement | null,
): HTMLElement | null | false {
	if (target === undefined || target === true) {
		return fallback();
	}
	if (target === false || target === null) {
		return false;
	}
	if (typeof target === 'function') {
		const result = target();
		if (result === false || result === null || result === undefined) {
			return result === false ? false : fallback();
		}
		if (result === true) {
			return fallback();
		}
		return result;
	}
	return target;
}

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
				(el) => !el.hasAttribute('disabled') && el.tabIndex !== -1,
			);

		const defaultInitial = (): HTMLElement | null => {
			const items = focusables();
			return items[0] ?? container;
		};

		const initial = resolveFocusTarget(options.initialFocus, defaultInitial);
		if (initial) {
			if (initial === container && !initial.hasAttribute('tabindex')) {
				initial.setAttribute('tabindex', '-1');
			}
			initial.focus();
		} else if (initial !== false) {
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
			const final = resolveFocusTarget(options.finalFocus, () => previouslyFocused);
			if (final) {
				final.focus();
				return;
			}
			if (final === false) return;
			if (options.restoreFocus !== false && previouslyFocused) {
				previouslyFocused.focus();
			}
		};
	});
}
