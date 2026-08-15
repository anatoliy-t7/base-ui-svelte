export type OpenChangeReason =
	| 'trigger-press'
	| 'trigger-hover'
	| 'trigger-focus'
	| 'outside-press'
	| 'escape-key'
	| 'close-press'
	| 'imperative-action';

let idCounter = 0;

export function useId(prefix = 'base-ui'): string {
	idCounter += 1;
	return `${prefix}-${idCounter}`;
}

/**
 * Controlled / uncontrolled open state.
 * Pass getters so prop updates stay reactive.
 */
export function createControllableOpen(options: {
	getOpen: () => boolean | undefined;
	getDefaultOpen: () => boolean;
	onOpenChange?:
		| ((open: boolean, eventDetails: { reason: OpenChangeReason }) => void)
		| undefined;
	setOpenProp?: ((open: boolean) => void) | undefined;
}) {
	let uncontrolled = $state(options.getDefaultOpen());

	const isControlled = $derived(options.getOpen() !== undefined);
	const open = $derived(isControlled ? Boolean(options.getOpen()) : uncontrolled);

	function setOpen(next: boolean, reason: OpenChangeReason): void {
		if (isControlled) {
			options.setOpenProp?.(next);
		} else {
			uncontrolled = next;
		}
		options.onOpenChange?.(next, { reason });
	}

	return {
		get open() {
			return open;
		},
		get isControlled() {
			return isControlled;
		},
		setOpen
	};
}

export function createControllableChecked(options: {
	getChecked: () => boolean | undefined;
	getDefaultChecked: () => boolean;
	onCheckedChange?: ((checked: boolean, event: Event) => void) | undefined;
	setCheckedProp?: ((checked: boolean) => void) | undefined;
}) {
	let uncontrolled = $state(options.getDefaultChecked());

	const isControlled = $derived(options.getChecked() !== undefined);
	const checked = $derived(isControlled ? Boolean(options.getChecked()) : uncontrolled);

	function setChecked(next: boolean, event: Event): void {
		if (isControlled) {
			options.setCheckedProp?.(next);
		} else {
			uncontrolled = next;
		}
		options.onCheckedChange?.(next, event);
	}

	return {
		get checked() {
			return checked;
		},
		setChecked
	};
}

export function createControllableNumber(options: {
	getValue: () => number | undefined;
	getDefaultValue: () => number;
	onValueChange?: ((value: number, event: Event) => void) | undefined;
	setValueProp?: ((value: number) => void) | undefined;
}) {
	let uncontrolled = $state(options.getDefaultValue());

	const isControlled = $derived(options.getValue() !== undefined);
	const value = $derived.by(() => {
		const controlled = options.getValue();
		return controlled !== undefined ? controlled : uncontrolled;
	});

	function setValue(next: number, event: Event): void {
		if (isControlled) {
			options.setValueProp?.(next);
		} else {
			uncontrolled = next;
		}
		options.onValueChange?.(next, event);
	}

	return {
		get value() {
			return value;
		},
		get isControlled() {
			return isControlled;
		},
		setValue
	};
}

function sliderValuesEqual(a: number | number[], b: number | number[]): boolean {
	if (typeof a === 'number' || typeof b === 'number') {
		return a === b;
	}
	if (a.length !== b.length) return false;
	return a.every((item, index) => item === b[index]);
}

export function createControllableSliderValue(options: {
	getValue: () => number | number[] | undefined;
	getDefaultValue: () => number | number[];
	onValueChange?: ((value: number | number[], event: Event) => void) | undefined;
	setValueProp?: ((value: number | number[]) => void) | undefined;
}) {
	let uncontrolled = $state.raw(options.getDefaultValue());

	const isControlled = $derived(options.getValue() !== undefined);
	const value = $derived.by(() => {
		const controlled = options.getValue();
		return controlled !== undefined ? controlled : uncontrolled;
	});

	function setValue(next: number | number[], event: Event): void {
		if (sliderValuesEqual(next, value)) return;
		if (isControlled) {
			options.setValueProp?.(next);
		} else {
			uncontrolled = next;
		}
		options.onValueChange?.(next, event);
	}

	return {
		get value() {
			return value;
		},
		get isControlled() {
			return isControlled;
		},
		setValue
	};
}
