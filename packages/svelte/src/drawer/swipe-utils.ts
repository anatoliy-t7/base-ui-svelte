import type { DrawerSnapPoint, DrawerSwipeDirection } from './types.js';

const DISMISS_PROGRESS = 0.3;
const OPEN_PROGRESS = 0.25;
const VELOCITY_THRESHOLD = 0.5;
const RUBBER_BAND = 0.15;

export { DISMISS_PROGRESS, OPEN_PROGRESS, VELOCITY_THRESHOLD };

export function axisDelta(
	direction: DrawerSwipeDirection,
	dx: number,
	dy: number
): number {
	switch (direction) {
		case 'down':
			return dy;
		case 'up':
			return -dy;
		case 'right':
			return dx;
		case 'left':
			return -dx;
	}
}

export function signedMovement(
	direction: DrawerSwipeDirection,
	delta: number
): { movementX: number; movementY: number } {
	switch (direction) {
		case 'down':
			return { movementX: 0, movementY: delta };
		case 'up':
			return { movementX: 0, movementY: -delta };
		case 'right':
			return { movementX: delta, movementY: 0 };
		case 'left':
			return { movementX: -delta, movementY: 0 };
	}
}

export function dismissSize(el: HTMLElement, direction: DrawerSwipeDirection): number {
	const rect = el.getBoundingClientRect();
	const size =
		direction === 'left' || direction === 'right' ? rect.width : rect.height;
	return Math.max(size, 1);
}

export function swipeStrength(progress: number): number {
	const clamped = Math.min(1, Math.max(0, progress));
	return 1 - Math.pow(clamped, 2);
}

/**
 * Apply resistance for positive progress and a light rubber-band past 0.
 * Returns applied delta (px) and normalized progress (0–1, never negative).
 */
export function applySwipeResistance(
	rawDelta: number,
	size: number
): { delta: number; progress: number } {
	if (rawDelta >= 0) {
		const progress = Math.min(1, rawDelta / size);
		const strength = swipeStrength(progress);
		const resisted = rawDelta * strength;
		return {
			delta: resisted,
			progress: Math.min(1, resisted / size)
		};
	}

	const overscroll = Math.abs(rawDelta);
	const band = Math.min(overscroll * RUBBER_BAND, size * RUBBER_BAND);
	return { delta: -band, progress: 0 };
}

export function resolveSnapFraction(
	point: DrawerSnapPoint,
	size: number
): number {
	if (typeof point === 'number') {
		if (point <= 1) {
			return Math.min(1, Math.max(0, point));
		}
		return Math.min(1, Math.max(0, point / size));
	}

	const trimmed = point.trim();
	if (trimmed.endsWith('%')) {
		const value = Number.parseFloat(trimmed.slice(0, -1));
		if (Number.isFinite(value)) {
			return Math.min(1, Math.max(0, value / 100));
		}
		return 1;
	}

	if (trimmed.endsWith('px')) {
		const value = Number.parseFloat(trimmed.slice(0, -2));
		if (Number.isFinite(value)) {
			return Math.min(1, Math.max(0, value / size));
		}
		return 1;
	}

	if (trimmed.endsWith('rem')) {
		const value = Number.parseFloat(trimmed.slice(0, -3));
		const rem =
			typeof document !== 'undefined'
				? Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
				: 16;
		if (Number.isFinite(value)) {
			return Math.min(1, Math.max(0, (value * rem) / size));
		}
		return 1;
	}

	const numeric = Number.parseFloat(trimmed);
	if (Number.isFinite(numeric)) {
		return Math.min(1, Math.max(0, numeric <= 1 ? numeric : numeric / size));
	}

	return 1;
}

export function resolveSnapFractions(
	snapPoints: ReadonlyArray<DrawerSnapPoint> | undefined,
	size: number
): number[] {
	if (!snapPoints || snapPoints.length === 0) {
		return [];
	}
	return snapPoints
		.map((point) => resolveSnapFraction(point, size))
		.sort((a, b) => a - b);
}

export function nearestSnapIndex(fractions: number[], value: number): number {
	if (fractions.length === 0) return 0;
	let bestIndex = 0;
	let bestDistance = Math.abs(fractions[0]! - value);
	for (let i = 1; i < fractions.length; i += 1) {
		const distance = Math.abs(fractions[i]! - value);
		if (distance < bestDistance) {
			bestDistance = distance;
			bestIndex = i;
		}
	}
	return bestIndex;
}

export function isFocusableField(target: EventTarget | null): target is HTMLElement {
	if (!(target instanceof HTMLElement)) return false;
	const tag = target.tagName;
	if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
	return target.isContentEditable;
}
