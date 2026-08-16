import {
	arrow,
	autoUpdate,
	computePosition,
	flip,
	offset,
	shift,
	type Placement,
} from '@floating-ui/dom';

export type Side = 'top' | 'right' | 'bottom' | 'left';
export type Align = 'start' | 'center' | 'end';

/** Floating UI–compatible virtual reference (e.g. pointer position). */
export type VirtualElement = {
	getBoundingClientRect(): DOMRect;
	contextElement?: Element;
};

export type PositionerStrategy = 'absolute' | 'fixed';

export type PositionerOptions = {
	readonly open: boolean;
	readonly anchor: () => Element | VirtualElement | null | undefined;
	readonly floating: () => HTMLElement | null | undefined;
	readonly arrowEl?: () => HTMLElement | null | undefined;
	readonly side?: Side;
	readonly align?: Align;
	readonly sideOffset?: number;
	readonly collisionPadding?: number;
	/** Floating UI strategy. Prefer `fixed` for pointer/virtual anchors. */
	readonly strategy?: PositionerStrategy;
};

function toPlacement(side: Side = 'bottom', align: Align = 'center'): Placement {
	if (align === 'center') return side;
	return `${side}-${align}`;
}

function placedSideOf(placement: Placement): Side {
	return placement.split('-')[0] as Side;
}

/**
 * Positions a floating element relative to an anchor using Floating UI.
 */
export function createPositioner(options: PositionerOptions) {
	$effect(() => {
		if (!options.open) return;

		const reference = options.anchor();
		const floating = options.floating();
		// Track arrow so positioning restarts when it mounts after the floating node.
		options.arrowEl?.();

		if (!reference || !floating) return;

		const preferredSide = options.side ?? 'bottom';
		const preferredAlign = options.align ?? 'center';
		const sideOffset = options.sideOffset ?? 8;
		const collisionPadding = options.collisionPadding ?? 8;
		const strategy = options.strategy ?? 'absolute';

		// Take out of document flow immediately so mount/focus cannot scroll the page.
		Object.assign(floating.style, {
			position: strategy,
			left: '0',
			top: '0',
		});

		const cleanup = autoUpdate(reference, floating, async () => {
			const arrowElement = options.arrowEl?.() ?? null;
			const middleware = [
				offset(sideOffset),
				flip({ padding: collisionPadding }),
				shift({ padding: collisionPadding }),
			];

			if (arrowElement) {
				middleware.push(arrow({ element: arrowElement, padding: 4 }));
			}

			const result = await computePosition(reference, floating, {
				placement: toPlacement(preferredSide, preferredAlign),
				strategy,
				middleware,
			});

			const placedSide = placedSideOf(result.placement);

			Object.assign(floating.style, {
				position: result.strategy,
				left: `${result.x}px`,
				top: `${result.y}px`,
			});
			floating.dataset.side = placedSide;

			if (arrowElement) {
				arrowElement.dataset.side = placedSide;

				const arrowData = result.middlewareData.arrow;
				if (arrowData) {
					const { x, y } = arrowData;
					const staticSide = {
						top: 'bottom',
						right: 'left',
						bottom: 'top',
						left: 'right',
					}[placedSide];

					// Non-square carets (e.g. 12×6) keep layout size when rotated 90° for
					// left/right, so the tip needs a larger inset than top/bottom.
					const overlap = 2;
					const { offsetWidth: w, offsetHeight: h } = arrowElement;
					const inset =
						placedSide === 'left' || placedSide === 'right' ? w / 2 + h / 2 - overlap : h - overlap;

					Object.assign(arrowElement.style, {
						position: 'absolute',
						left: x != null ? `${x}px` : '',
						top: y != null ? `${y}px` : '',
						right: '',
						bottom: '',
						[staticSide]: `${-inset}px`,
					});
				}
			}
		});

		return cleanup;
	});
}
