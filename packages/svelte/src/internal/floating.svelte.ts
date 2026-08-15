import {
	arrow,
	autoUpdate,
	computePosition,
	flip,
	offset,
	shift,
	type Placement
} from '@floating-ui/dom';

export type Side = 'top' | 'right' | 'bottom' | 'left';
export type Align = 'start' | 'center' | 'end';

/** Floating UI–compatible virtual reference (e.g. pointer position). */
export type VirtualElement = {
	getBoundingClientRect(): DOMRect;
	contextElement?: Element;
};

export type PositionerOptions = {
	readonly open: boolean;
	readonly anchor: () => Element | VirtualElement | null | undefined;
	readonly floating: () => HTMLElement | null | undefined;
	readonly arrowEl?: () => HTMLElement | null | undefined;
	readonly side?: Side;
	readonly align?: Align;
	readonly sideOffset?: number;
	readonly collisionPadding?: number;
};

function toPlacement(side: Side = 'bottom', align: Align = 'center'): Placement {
	if (align === 'center') return side;
	return `${side}-${align}`;
}

/**
 * Positions a floating element relative to an anchor using Floating UI.
 */
export function createPositioner(options: PositionerOptions) {
	$effect(() => {
		if (!options.open) return;

		const reference = options.anchor();
		const floating = options.floating();
		if (!reference || !floating) return;

		const side = options.side ?? 'bottom';
		const align = options.align ?? 'center';
		const sideOffset = options.sideOffset ?? 8;
		const collisionPadding = options.collisionPadding ?? 8;

		const middleware = [
			offset(sideOffset),
			flip({ padding: collisionPadding }),
			shift({ padding: collisionPadding })
		];

		const arrowElement = options.arrowEl?.();
		if (arrowElement) {
			middleware.push(arrow({ element: arrowElement, padding: 4 }));
		}

		const cleanup = autoUpdate(reference, floating, async () => {
			const result = await computePosition(reference, floating, {
				placement: toPlacement(side, align),
				middleware
			});

			Object.assign(floating.style, {
				position: result.strategy,
				left: `${result.x}px`,
				top: `${result.y}px`
			});

			if (arrowElement && result.middlewareData.arrow) {
				const { x, y } = result.middlewareData.arrow;
				const staticSide = {
					top: 'bottom',
					right: 'left',
					bottom: 'top',
					left: 'right'
				}[result.placement.split('-')[0] as Side];

				Object.assign(arrowElement.style, {
					left: x != null ? `${x}px` : '',
					top: y != null ? `${y}px` : '',
					right: '',
					bottom: '',
					[staticSide]: '-4px'
				});
			}
		});

		return cleanup;
	});
}
