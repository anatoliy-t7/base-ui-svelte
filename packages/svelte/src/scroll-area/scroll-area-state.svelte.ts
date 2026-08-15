import type { ScrollAreaMetrics } from './types.js';

const emptyMetrics: ScrollAreaMetrics = {
	scrollTop: 0,
	scrollLeft: 0,
	scrollHeight: 0,
	scrollWidth: 0,
	clientHeight: 0,
	clientWidth: 0
};

export class ScrollAreaState {
	/** Plain ref — mutated during attach without touching reactive state. */
	viewport: HTMLElement | null = null;
	scrolling = $state(false);
	metrics = $state<ScrollAreaMetrics>(emptyMetrics);

	#scrollEndTimer: number | undefined;

	setViewport(node: HTMLElement | null): void {
		this.viewport = node;
	}

	refreshMetrics(): void {
		const viewport = this.viewport;
		if (!viewport) {
			this.metrics = emptyMetrics;
			return;
		}
		this.metrics = {
			scrollTop: viewport.scrollTop,
			scrollLeft: viewport.scrollLeft,
			scrollHeight: viewport.scrollHeight,
			scrollWidth: viewport.scrollWidth,
			clientHeight: viewport.clientHeight,
			clientWidth: viewport.clientWidth
		};
	}

	scrollTo(options: { top?: number; left?: number }): void {
		const viewport = this.viewport;
		if (!viewport) return;
		viewport.scrollTo({
			top: options.top ?? viewport.scrollTop,
			left: options.left ?? viewport.scrollLeft
		});
		this.refreshMetrics();
	}

	markScrolling(): void {
		this.scrolling = true;
		if (this.#scrollEndTimer !== undefined) {
			window.clearTimeout(this.#scrollEndTimer);
		}
		this.#scrollEndTimer = window.setTimeout(() => {
			this.scrolling = false;
			this.#scrollEndTimer = undefined;
		}, 150);
	}
}
