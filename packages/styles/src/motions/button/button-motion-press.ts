export type ButtonMotionPhase = 'press' | 'release';

/** Matches `Attachment` from `svelte/attachments` — kept local so styles stays dependency-free. */
export type ButtonMotionPressAttachment = (element: HTMLElement) => void | (() => void);

export type ButtonMotionPressOptions = {
	releaseDurationMs?: number;
	getReleaseDurationMs?: (element: HTMLElement) => number;
};

const DEFAULT_RELEASE_MS = 600;

function isDisabled(element: HTMLElement): boolean {
	return (
		element.dataset.disabled !== undefined ||
		(element instanceof HTMLButtonElement && element.disabled) ||
		element.getAttribute('aria-disabled') === 'true'
	);
}

function getPhase(element: HTMLElement): ButtonMotionPhase | undefined {
	const phase = element.dataset.motionPhase;
	if (phase === 'press' || phase === 'release') {
		return phase;
	}
	return undefined;
}

function releaseDurationMs(_element: HTMLElement): number {
	return DEFAULT_RELEASE_MS;
}

function setPhase(element: HTMLElement, phase: ButtonMotionPhase | null): void {
	if (phase === null) {
		delete element.dataset.motionPhase;
		return;
	}
	element.dataset.motionPhase = phase;
}

/** {@attach} factory for press + release motion classes. */
export function buttonMotionPress(options?: ButtonMotionPressOptions): ButtonMotionPressAttachment {
	return (element) => {
		let releaseTimer: ReturnType<typeof setTimeout> | undefined;

		function clearTimer(): void {
			if (releaseTimer === undefined) {
				return;
			}
			clearTimeout(releaseTimer);
			releaseTimer = undefined;
		}

		function press(event: PointerEvent | KeyboardEvent): void {
			if (isDisabled(element)) {
				return;
			}
			if (event instanceof PointerEvent && event.button !== 0) {
				return;
			}
			clearTimer();
			setPhase(element, 'press');
		}

		function release(): void {
			if (isDisabled(element)) {
				return;
			}
			if (getPhase(element) !== 'press') {
				return;
			}
			clearTimer();
			setPhase(element, 'release');
			const duration =
				options?.getReleaseDurationMs?.(element) ??
				options?.releaseDurationMs ??
				releaseDurationMs(element);
			releaseTimer = setTimeout(() => {
				setPhase(element, null);
				releaseTimer = undefined;
			}, duration);
		}

		function onPointerDown(event: PointerEvent): void {
			press(event);
		}

		function onPointerUp(): void {
			release();
		}

		function onPointerLeave(): void {
			if (getPhase(element) === 'press') {
				release();
			}
		}

		function onPointerCancel(): void {
			if (getPhase(element) === 'press') {
				release();
			}
		}

		function onKeyDown(event: KeyboardEvent): void {
			if (event.key !== ' ' && event.key !== 'Enter') {
				return;
			}
			if (event.repeat) {
				return;
			}
			event.preventDefault();
			press(event);
		}

		function onKeyUp(event: KeyboardEvent): void {
			if (event.key !== ' ' && event.key !== 'Enter') {
				return;
			}
			release();
		}

		element.addEventListener('pointerdown', onPointerDown);
		element.addEventListener('pointerup', onPointerUp);
		element.addEventListener('pointerleave', onPointerLeave);
		element.addEventListener('pointercancel', onPointerCancel);
		element.addEventListener('keydown', onKeyDown);
		element.addEventListener('keyup', onKeyUp);

		return () => {
			clearTimer();
			element.removeEventListener('pointerdown', onPointerDown);
			element.removeEventListener('pointerup', onPointerUp);
			element.removeEventListener('pointerleave', onPointerLeave);
			element.removeEventListener('pointercancel', onPointerCancel);
			element.removeEventListener('keydown', onKeyDown);
			element.removeEventListener('keyup', onKeyUp);
			delete element.dataset.motionPhase;
		};
	};
}
