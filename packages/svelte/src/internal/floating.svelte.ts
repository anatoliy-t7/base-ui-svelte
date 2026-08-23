import {
	arrow,
	autoUpdate,
	computePosition,
	flip,
	limitShift,
	offset,
	shift,
	type Boundary,
	type Middleware,
	type Padding,
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

export type CollisionAvoidance = {
	readonly side?: 'flip' | 'none';
	readonly align?: 'flip' | 'shift' | 'none';
};

/**
 * Shared Positioner props aligned with Base UI React naming.
 * Components may omit fields they don't expose yet.
 */
export type SharedPositionerProps = {
	side?: Side;
	align?: Align;
	sideOffset?: number;
	alignOffset?: number;
	collisionPadding?: number | Partial<Record<Side, number>>;
	collisionBoundary?: Boundary | null;
	collisionAvoidance?: CollisionAvoidance;
	arrowPadding?: number;
	sticky?: boolean;
	/** Maps to Floating UI strategy (`absolute` | `fixed`). */
	positionMethod?: PositionerStrategy;
	/**
	 * @deprecated Prefer {@link positionMethod}. Kept for internal callers.
	 */
	strategy?: PositionerStrategy;
	/** Override the positioning anchor (element or virtual element). */
	anchor?: Element | VirtualElement | null;
	/**
	 * When `true`, skip continuous layout tracking of the anchor
	 * (position once; no resize/scroll auto-updates beyond the initial compute).
	 * @default false
	 */
	disableAnchorTracking?: boolean;
};

export type PositionerOptions = {
	readonly open: boolean;
	readonly anchor: () => Element | VirtualElement | null | undefined;
	readonly floating: () => HTMLElement | null | undefined;
	readonly arrowEl?: (() => HTMLElement | null | undefined) | undefined;
	readonly side?: Side | undefined;
	readonly align?: Align | undefined;
	readonly sideOffset?: number | undefined;
	readonly alignOffset?: number | undefined;
	readonly collisionPadding?: number | Partial<Record<Side, number>> | undefined;
	readonly collisionBoundary?: Boundary | null | undefined;
	readonly collisionAvoidance?: CollisionAvoidance | undefined;
	readonly arrowPadding?: number | undefined;
	readonly sticky?: boolean | undefined;
	readonly positionMethod?: PositionerStrategy | undefined;
	/** @deprecated Prefer {@link positionMethod}. */
	readonly strategy?: PositionerStrategy | undefined;
	readonly disableAnchorTracking?: boolean | undefined;
};

function toPlacement(side: Side = 'bottom', align: Align = 'center'): Placement {
	if (align === 'center') return side;
	return `${side}-${align}`;
}

function placedSideOf(placement: Placement): Side {
	return placement.split('-')[0] as Side;
}

function toPadding(value: number | Partial<Record<Side, number>> | undefined, fallback: number): Padding {
	if (value == null) return fallback;
	if (typeof value === 'number') return value;
	return {
		top: value.top ?? fallback,
		right: value.right ?? fallback,
		bottom: value.bottom ?? fallback,
		left: value.left ?? fallback,
	};
}

function buildMiddleware(options: {
	sideOffset: number;
	alignOffset: number;
	collisionPadding: Padding;
	collisionBoundary: Boundary | undefined;
	collisionAvoidance: CollisionAvoidance;
	sticky: boolean;
	arrowElement: HTMLElement | null;
	arrowPadding: number;
}): Middleware[] {
	const {
		sideOffset,
		alignOffset,
		collisionPadding,
		collisionBoundary,
		collisionAvoidance,
		sticky,
		arrowElement,
		arrowPadding,
	} = options;

	const middleware: Middleware[] = [
		offset({ mainAxis: sideOffset, crossAxis: alignOffset }),
	];

	const sideMode = collisionAvoidance.side ?? 'flip';
	const alignMode = collisionAvoidance.align ?? 'flip';

	if (sideMode === 'flip') {
		middleware.push(
			flip({
				padding: collisionPadding,
				...(collisionBoundary != null ? { boundary: collisionBoundary } : {}),
			}),
		);
	}

	if (alignMode === 'shift' || sticky || sideMode === 'none') {
		middleware.push(
			shift({
				padding: collisionPadding,
				...(collisionBoundary != null ? { boundary: collisionBoundary } : {}),
				...(sticky ? { limiter: limitShift() } : {}),
				mainAxis: true,
				crossAxis: sticky || alignMode === 'shift',
			}),
		);
	} else if (alignMode === 'flip') {
		// Default: keep shift on the main collision axis so the popup stays in view.
		middleware.push(
			shift({
				padding: collisionPadding,
				...(collisionBoundary != null ? { boundary: collisionBoundary } : {}),
			}),
		);
	}

	if (arrowElement) {
		middleware.push(arrow({ element: arrowElement, padding: arrowPadding }));
	}

	return middleware;
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
		const alignOffset = options.alignOffset ?? 0;
		const collisionPadding = toPadding(options.collisionPadding, 8);
		const collisionBoundary = options.collisionBoundary ?? undefined;
		const collisionAvoidance = options.collisionAvoidance ?? {};
		const arrowPadding = options.arrowPadding ?? 4;
		const sticky = options.sticky ?? false;
		const strategy = options.positionMethod ?? options.strategy ?? 'absolute';
		const disableAnchorTracking = options.disableAnchorTracking ?? false;

		// Take out of document flow immediately so mount/focus cannot scroll the page.
		Object.assign(floating.style, {
			position: strategy,
			left: '0',
			top: '0',
		});

		const update = async () => {
			const arrowElement = options.arrowEl?.() ?? null;
			const middleware = buildMiddleware({
				sideOffset,
				alignOffset,
				collisionPadding,
				collisionBoundary,
				collisionAvoidance,
				sticky,
				arrowElement,
				arrowPadding,
			});

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
		};

		if (disableAnchorTracking) {
			void update();
			return;
		}

		return autoUpdate(reference, floating, () => {
			void update();
		});
	});
}
