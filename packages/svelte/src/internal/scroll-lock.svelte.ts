import { untrack } from 'svelte';

/**
 * Document scroll lock for modal overlays (Dialog / Drawer / Alert Dialog).
 * Adapted from Base UI `useScrollLock`: hides the page scrollbar, blocks
 * background scroll, and compensates classic-scrollbar layout shift.
 */

type StyleSnapshot = Partial<CSSStyleDeclaration>;

let originalHtmlStyles: StyleSnapshot = {};
let originalBodyStyles: StyleSnapshot = {};
let originalHtmlScrollBehavior = '';

function isOverflowElement(element: Element): boolean {
	const { overflow, overflowX, overflowY } = getComputedStyle(element);
	return /auto|scroll|overlay|hidden/.test(`${overflow}${overflowX}${overflowY}`);
}

/**
 * Viewport overflow comes from `<html>` when it establishes a scroll container,
 * and from `<body>` otherwise. Prefer `<html>` for the default (both `visible`)
 * case so the page scrollbar actually disappears.
 */
function getViewportScroller(html: HTMLElement, body: HTMLElement): HTMLElement {
	if (isOverflowElement(html)) return html;
	if (isOverflowElement(body)) return body;
	return html;
}

function isIOS(): boolean {
	if (typeof navigator === 'undefined') return false;
	return (
		/iP(ad|hone|od)/.test(navigator.userAgent) ||
		(navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
	);
}

function isWebKit(): boolean {
	if (typeof navigator === 'undefined') return false;
	return (
		/AppleWebKit/.test(navigator.userAgent) && !/Chrome|Chromium|Edg\//.test(navigator.userAgent)
	);
}

function hasInsetScrollbars(doc: Document): boolean {
	const win = doc.defaultView;
	if (!win) return false;
	return win.innerWidth - doc.documentElement.clientWidth > 0;
}

function preventScrollOverlayScrollbars(doc: Document): () => void {
	const html = doc.documentElement;
	const body = doc.body;
	const elementToLock = getViewportScroller(html, body);
	const original = {
		overflowY: elementToLock.style.overflowY,
		overflowX: elementToLock.style.overflowX,
	};
	elementToLock.style.overflowY = 'hidden';
	elementToLock.style.overflowX = 'hidden';
	return () => {
		elementToLock.style.overflowY = original.overflowY;
		elementToLock.style.overflowX = original.overflowX;
	};
}

function preventScrollInsetScrollbars(doc: Document): () => void {
	const html = doc.documentElement;
	const body = doc.body;
	const win = doc.defaultView;
	if (!win) return () => {};

	let scrollTop = 0;
	let scrollLeft = 0;
	let resizeRaf = 0;

	const supportsStableScrollbarGutter =
		typeof CSS !== 'undefined' && typeof CSS.supports === 'function'
			? CSS.supports('scrollbar-gutter', 'stable')
			: false;

	// Pinch-zoom in Safari causes a shift — skip lock while zoomed.
	if (isWebKit() && (win.visualViewport?.scale ?? 1) !== 1) {
		return () => {};
	}

	function lockScroll(): void {
		const htmlStyles = win!.getComputedStyle(html);
		const bodyStyles = win!.getComputedStyle(body);
		const htmlScrollbarGutterValue = htmlStyles.scrollbarGutter || '';
		const hasBothEdges = htmlScrollbarGutterValue.includes('both-edges');
		const scrollbarGutterValue = hasBothEdges ? 'stable both-edges' : 'stable';

		scrollTop = html.scrollTop;
		scrollLeft = html.scrollLeft;

		originalHtmlStyles = {
			scrollbarGutter: html.style.scrollbarGutter,
			overflowY: html.style.overflowY,
			overflowX: html.style.overflowX,
		};
		originalHtmlScrollBehavior = html.style.scrollBehavior;

		originalBodyStyles = {
			position: body.style.position,
			height: body.style.height,
			width: body.style.width,
			boxSizing: body.style.boxSizing,
			overflowY: body.style.overflowY,
			overflowX: body.style.overflowX,
			scrollBehavior: body.style.scrollBehavior,
		};

		const isScrollableY = html.scrollHeight > html.clientHeight;
		const isScrollableX = html.scrollWidth > html.clientWidth;
		const hasConstantOverflowY =
			htmlStyles.overflowY === 'scroll' || bodyStyles.overflowY === 'scroll';
		const hasConstantOverflowX =
			htmlStyles.overflowX === 'scroll' || bodyStyles.overflowX === 'scroll';

		const scrollbarWidth = Math.max(0, win!.innerWidth - html.clientWidth);
		const scrollbarHeight = Math.max(0, win!.innerHeight - html.clientHeight);

		const marginY = parseFloat(bodyStyles.marginTop) + parseFloat(bodyStyles.marginBottom);
		const marginX = parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight);
		const elementToLock = getViewportScroller(html, body);

		if (supportsStableScrollbarGutter) {
			html.style.scrollbarGutter = scrollbarGutterValue;
			elementToLock.style.overflowY = 'hidden';
			elementToLock.style.overflowX = 'hidden';
			return;
		}

		Object.assign(html.style, {
			scrollbarGutter: scrollbarGutterValue,
			overflowY: 'hidden',
			overflowX: 'hidden',
		});

		if (isScrollableY || hasConstantOverflowY) {
			html.style.overflowY = 'scroll';
		}
		if (isScrollableX || hasConstantOverflowX) {
			html.style.overflowX = 'scroll';
		}

		Object.assign(body.style, {
			position: 'relative',
			height:
				marginY || scrollbarHeight ? `calc(100dvh - ${marginY + scrollbarHeight}px)` : '100dvh',
			width: marginX || scrollbarWidth ? `calc(100vw - ${marginX + scrollbarWidth}px)` : '100vw',
			boxSizing: 'border-box',
			overflow: 'hidden',
			scrollBehavior: 'unset',
		});

		body.scrollTop = scrollTop;
		body.scrollLeft = scrollLeft;
		html.setAttribute('data-base-ui-scroll-locked', '');
		html.style.scrollBehavior = 'unset';
	}

	function cleanup(): void {
		Object.assign(html.style, originalHtmlStyles);
		Object.assign(body.style, originalBodyStyles);
		html.removeAttribute('data-base-ui-scroll-locked');

		if (!supportsStableScrollbarGutter) {
			html.scrollTop = scrollTop;
			html.scrollLeft = scrollLeft;
			html.style.scrollBehavior = originalHtmlScrollBehavior;
		}
	}

	function handleResize(): void {
		cleanup();
		cancelAnimationFrame(resizeRaf);
		resizeRaf = requestAnimationFrame(() => {
			lockScroll();
		});
	}

	lockScroll();
	win.addEventListener('resize', handleResize);

	return () => {
		cancelAnimationFrame(resizeRaf);
		cleanup();
		win.removeEventListener('resize', handleResize);
	};
}

class ScrollLocker {
	lockCount = 0;
	restore: (() => void) | null = null;
	private lockTimer: ReturnType<typeof setTimeout> | null = null;
	private unlockTimer: ReturnType<typeof setTimeout> | null = null;

	acquire(referenceElement: Element | null): () => void {
		this.lockCount += 1;
		if (this.lockCount === 1 && this.restore === null) {
			if (this.unlockTimer != null) {
				clearTimeout(this.unlockTimer);
				this.unlockTimer = null;
			}
			this.lockTimer = setTimeout(() => {
				this.lockTimer = null;
				this.lock(referenceElement);
			}, 0);
		}
		return this.release;
	}

	private release = (): void => {
		this.lockCount -= 1;
		if (this.lockCount !== 0) return;

		if (this.lockTimer != null) {
			clearTimeout(this.lockTimer);
			this.lockTimer = null;
		}
		if (this.restore) {
			this.unlockTimer = setTimeout(() => {
				this.unlockTimer = null;
				this.unlock();
			}, 0);
		}
	};

	private unlock = (): void => {
		if (this.lockCount === 0 && this.restore) {
			this.restore();
			this.restore = null;
		}
	};

	private lock(referenceElement: Element | null): void {
		if (this.lockCount === 0 || this.restore !== null) {
			return;
		}

		const doc = referenceElement?.ownerDocument ?? document;
		const html = doc.documentElement;
		const win = doc.defaultView;
		if (!win) {
			this.restore = () => {};
			return;
		}

		const htmlOverflowY = win.getComputedStyle(html).overflowY;
		if (htmlOverflowY === 'hidden' || htmlOverflowY === 'clip') {
			this.restore = () => {};
			return;
		}

		const hasOverlayScrollbars = isIOS() || !hasInsetScrollbars(doc);
		this.restore = hasOverlayScrollbars
			? preventScrollOverlayScrollbars(doc)
			: preventScrollInsetScrollbars(doc);
	}
}

const SCROLL_LOCKER = new ScrollLocker();

export type ScrollLockOptions = {
	readonly enabled: boolean;
	/** Element used to resolve the owner document (defaults to `document`). */
	readonly reference?: (() => Element | null | undefined) | undefined;
};

/**
 * Locks document scroll while `enabled` is true. Nested callers share one lock.
 */
export function createScrollLock(options: ScrollLockOptions): void {
	$effect(() => {
		if (!options.enabled) return;
		if (typeof document === 'undefined') return;

		// Don't re-acquire when the popup node mounts — only `enabled` should drive the lock.
		const reference = untrack(() => options.reference?.() ?? null);
		return SCROLL_LOCKER.acquire(reference);
	});
}

/** Treat popups within this much of the viewport width as full-width (Base UI). */
const VIEWPORT_WIDTH_TOLERANCE_PX = 20;

export type AnchoredPopupScrollLockOptions = {
	/** Whether scroll lock is requested (usually `open && modal`). */
	readonly enabled: boolean;
	/**
	 * When true, scroll lock applies only if the positioner is effectively
	 * viewport-wide (touch / coarse-pointer opens).
	 */
	readonly touchOpen: boolean;
	readonly positioner?: (() => HTMLElement | null | undefined) | undefined;
	readonly reference?: (() => Element | null | undefined) | undefined;
};

/**
 * Scroll lock for anchored popups (Menu, Select, Combobox, Popover).
 * Matches Base UI `useAnchoredPopupScrollLock`.
 */
export function createAnchoredPopupScrollLock(options: AnchoredPopupScrollLockOptions): void {
	let touchOpenShouldLockScroll = $state(false);

	$effect(() => {
		if (!options.enabled || !options.touchOpen) {
			touchOpenShouldLockScroll = false;
			return;
		}
		const positionerElement = options.positioner?.() ?? null;
		if (positionerElement == null) {
			touchOpenShouldLockScroll = false;
			return;
		}
		const viewportWidth = positionerElement.ownerDocument.documentElement.clientWidth;
		const popupWidth = positionerElement.offsetWidth;
		touchOpenShouldLockScroll =
			viewportWidth > 0 &&
			popupWidth > 0 &&
			popupWidth >= viewportWidth - VIEWPORT_WIDTH_TOLERANCE_PX;
	});

	createScrollLock({
		get enabled() {
			return options.enabled && (!options.touchOpen || touchOpenShouldLockScroll);
		},
		reference: options.reference,
	});
}

/** Coarse pointers (touch) approximate Base UI `openMethod === 'touch'`. */
export function isCoarsePointer(): boolean {
	if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
		return false;
	}
	return window.matchMedia('(pointer: coarse)').matches;
}
