import type { OpenChangeReason } from './controllable.svelte.js';

export type PopupHandleController = {
	setOpen(open: boolean, reason: OpenChangeReason): void;
	getOpen(): boolean;
};

/**
 * Imperative handle connecting a Root with detached Triggers (Base UI `createHandle` pattern).
 * Methods no-op until a Root attaches via {@link PopupHandle.attach}.
 */
export class PopupHandle<Payload = unknown> {
	#controller: PopupHandleController | null = null;
	#payload: Payload | undefined;
	#activeTriggerId: string | null = null;

	/**
	 * @internal Called by Root while mounted.
	 */
	attach(controller: PopupHandleController): () => void {
		this.#controller = controller;
		return () => {
			if (this.#controller === controller) {
				this.#controller = null;
			}
		};
	}

	/**
	 * Opens the popup. Pass a trigger id when associating a detached trigger.
	 */
	open(triggerId: string | null = null): void {
		this.#activeTriggerId = triggerId;
		this.#controller?.setOpen(true, 'imperative-action');
	}

	/**
	 * Opens with a payload (Dialog / Alert Dialog / Drawer / Menu).
	 */
	openWithPayload(payload: Payload): void {
		this.#payload = payload;
		this.open(null);
	}

	close(): void {
		this.#controller?.setOpen(false, 'imperative-action');
	}

	get isOpen(): boolean {
		return this.#controller?.getOpen() ?? false;
	}

	get payload(): Payload | undefined {
		return this.#payload;
	}

	get activeTriggerId(): string | null {
		return this.#activeTriggerId;
	}

	/** @internal */
	clearPayload(): void {
		this.#payload = undefined;
	}
}

export function createPopupHandle<Payload = unknown>(): PopupHandle<Payload> {
	return new PopupHandle<Payload>();
}
