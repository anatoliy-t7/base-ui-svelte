/**
 * Shared open/close hover-intent timers for tooltip, menu, preview-card, etc.
 */
export function createHoverDelay(getOpenDelay: () => number, getCloseDelay: () => number) {
	let openTimeout: ReturnType<typeof setTimeout> | null = null;
	let closeTimeout: ReturnType<typeof setTimeout> | null = null;

	function cancelOpen(): void {
		if (openTimeout != null) {
			clearTimeout(openTimeout);
			openTimeout = null;
		}
	}

	function cancelClose(): void {
		if (closeTimeout != null) {
			clearTimeout(closeTimeout);
			closeTimeout = null;
		}
	}

	function cancel(): void {
		cancelOpen();
		cancelClose();
	}

	function openWithDelay(cb: () => void): void {
		cancelClose();
		cancelOpen();
		const delay = getOpenDelay();
		if (delay <= 0) {
			cb();
			return;
		}
		openTimeout = setTimeout(() => {
			openTimeout = null;
			cb();
		}, delay);
	}

	function closeWithDelay(cb: () => void): void {
		cancelOpen();
		cancelClose();
		const delay = getCloseDelay();
		if (delay <= 0) {
			cb();
			return;
		}
		closeTimeout = setTimeout(() => {
			closeTimeout = null;
			cb();
		}, delay);
	}

	function dispose(): void {
		cancel();
	}

	return {
		openWithDelay,
		closeWithDelay,
		cancel,
		dispose,
	};
}
