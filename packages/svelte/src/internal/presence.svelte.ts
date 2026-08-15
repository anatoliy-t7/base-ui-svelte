import { tick } from 'svelte';

export type PresenceStatus = 'mounted' | 'unmounted' | 'hiding';

/**
 * Keeps content mounted while closed so CSS can animate using data-open / data-closed.
 */
export function createPresence(getPresent: () => boolean) {
	let status = $state<PresenceStatus>(getPresent() ? 'mounted' : 'unmounted');
	let hasBeenPresent = getPresent();

	$effect(() => {
		const present = getPresent();

		if (present) {
			hasBeenPresent = true;
			status = 'mounted';
			return;
		}

		if (!hasBeenPresent) {
			status = 'unmounted';
			return;
		}

		status = 'hiding';
		const timeout = window.setTimeout(() => {
			status = 'unmounted';
		}, 150);

		return () => {
			window.clearTimeout(timeout);
		};
	});

	function onExitComplete(): void {
		status = 'unmounted';
	}

	async function forceMount(): Promise<void> {
		status = 'mounted';
		await tick();
	}

	return {
		get status() {
			return status;
		},
		get isPresent() {
			return status !== 'unmounted';
		},
		get isVisible() {
			return getPresent() && status === 'mounted';
		},
		onExitComplete,
		forceMount
	};
}
