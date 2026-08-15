export type DismissOptions = {
	readonly enabled: boolean;
	readonly refs: () => Array<HTMLElement | null | undefined>;
	readonly onDismiss: (event: Event) => void;
	readonly dismissOnEscape?: boolean;
	readonly dismissOnOutsidePress?: boolean;
};

/**
 * Listens for Escape and pointer-down outside the provided refs.
 */
export function createDismiss(options: DismissOptions) {
	$effect(() => {
		if (!options.enabled) return;

		const onKeyDown = (event: KeyboardEvent) => {
			if (options.dismissOnEscape === false) return;
			if (event.key === 'Escape') {
				options.onDismiss(event);
			}
		};

		const onPointerDown = (event: PointerEvent) => {
			if (options.dismissOnOutsidePress === false) return;
			const target = event.target;
			if (!(target instanceof Node)) return;

			const elements = options.refs().filter((el): el is HTMLElement => el != null);
			const inside = elements.some((el) => el.contains(target));
			if (!inside) {
				options.onDismiss(event);
			}
		};

		document.addEventListener('keydown', onKeyDown);
		document.addEventListener('pointerdown', onPointerDown, true);

		return () => {
			document.removeEventListener('keydown', onKeyDown);
			document.removeEventListener('pointerdown', onPointerDown, true);
		};
	});
}
