/**
 * Layout-aware measurement helpers for Tabs.Indicator.
 * Prefer rect-based offsets when they agree with layout offsets; otherwise
 * fall back to offsetParent walks so 3D/skew/rotate ancestors don't misalign.
 */

const MAX_LAYOUT_ROUNDING_ERROR = 2;

function getCumulativeOffset(element: HTMLElement): { left: number; top: number } {
	let left = 0;
	let top = 0;
	let current: HTMLElement | null = element;

	while (current != null) {
		left += current.offsetLeft;
		top += current.offsetTop;

		const offsetParent = current.offsetParent as HTMLElement | null;
		if (offsetParent != null) {
			left += offsetParent.clientLeft;
			top += offsetParent.clientTop;
		}

		current = offsetParent;
	}

	return { left, top };
}

function getLayoutOffset(
	element: HTMLElement,
	ancestor: HTMLElement,
): { left: number; top: number } {
	const elementOffset = getCumulativeOffset(element);
	const ancestorOffset = getCumulativeOffset(ancestor);

	let left = elementOffset.left - ancestorOffset.left - ancestor.clientLeft;
	let top = elementOffset.top - ancestorOffset.top - ancestor.clientTop;

	// Scroll containers between the tab and the list move the tab on screen
	// without changing its layout slot — subtract that scroll so the layout
	// offset stays comparable with the rect-based one. The list's own scroll
	// is excluded (indicator scrolls with the tab).
	let node: HTMLElement | null = element.parentElement;
	while (node != null && node !== ancestor) {
		left -= node.scrollLeft;
		top -= node.scrollTop;
		node = node.parentElement;
	}

	return { left, top };
}

function resolveTranslateLength(value: string | undefined, referenceSize: number): number {
	if (!value) return 0;
	const numeric = Number.parseFloat(value);
	if (!Number.isFinite(numeric)) return 0;
	return value.endsWith('%') ? (numeric / 100) * referenceSize : numeric;
}

function getActiveTabTranslation(element: HTMLElement): { x: number; y: number } {
	const computedStyle = getComputedStyle(element);
	const transform = computedStyle.transform;
	let translateX = 0;
	let translateY = 0;

	if (transform && transform !== 'none') {
		const match = transform.match(/matrix\(([^)]+)\)/);
		if (match?.[1]) {
			const parts = match[1].split(',').map((part) => Number.parseFloat(part.trim()));
			// matrix(a, b, c, d, tx, ty)
			if (parts.length >= 6) {
				translateX = parts[4] ?? 0;
				translateY = parts[5] ?? 0;
			}
		} else {
			const match3d = transform.match(/matrix3d\(([^)]+)\)/);
			if (match3d?.[1]) {
				const parts = match3d[1].split(',').map((part) => Number.parseFloat(part.trim()));
				// matrix3d: indices 12, 13 are tx, ty
				if (parts.length >= 14) {
					translateX = parts[12] ?? 0;
					translateY = parts[13] ?? 0;
				}
			}
		}
	}

	const { translate } = computedStyle;
	if (translate && translate !== 'none') {
		const parts = translate.split(' ');
		translateX += resolveTranslateLength(parts[0], element.offsetWidth);
		translateY += resolveTranslateLength(parts[1], element.offsetHeight);
	}

	return { x: translateX, y: translateY };
}

export type IndicatorMetrics = {
	left: number;
	top: number;
	width: number;
	height: number;
};

/**
 * Measure the active tab relative to the tab list, choosing rect vs layout
 * offsets based on transform agreement.
 */
export function measureTabIndicator(
	list: HTMLElement,
	tab: HTMLElement,
): IndicatorMetrics {
	const layoutOffset = getLayoutOffset(tab, list);
	let left = layoutOffset.left;
	let top = layoutOffset.top;

	const tabRect = tab.getBoundingClientRect();
	const listRect = list.getBoundingClientRect();
	const listWidth = list.offsetWidth || listRect.width;
	const listHeight = list.offsetHeight || listRect.height;
	const scaleX = listWidth > 0 ? listRect.width / listWidth : 1;
	const scaleY = listHeight > 0 ? listRect.height / listHeight : 1;

	const rectLeft =
		(tabRect.left - listRect.left) / scaleX + list.scrollLeft - list.clientLeft;
	const rectTop =
		(tabRect.top - listRect.top) / scaleY + list.scrollTop - list.clientTop;

	const tabTranslation = getActiveTabTranslation(tab);
	if (
		Math.abs(rectLeft - tabTranslation.x - left) <= MAX_LAYOUT_ROUNDING_ERROR &&
		Math.abs(rectTop - tabTranslation.y - top) <= MAX_LAYOUT_ROUNDING_ERROR
	) {
		left = rectLeft;
		top = rectTop;
	}

	const width = tab.offsetWidth || tabRect.width;
	const height = tab.offsetHeight || tabRect.height;

	return { left, top, width, height };
}
