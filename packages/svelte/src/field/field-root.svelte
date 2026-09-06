<script lang="ts">
	import { getContext, hasContext, setContext } from 'svelte';
	import { useId } from '../internal/controllable.svelte.js';
	import { FIELD_CONTEXT, FORM_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { FormContext } from '../form/types.js';
	import {
		DEFAULT_VALIDITY_FLAGS,
		type FieldContext,
		type FieldRootProps,
		type FieldValidityFlags,
	} from './types.js';

	let {
		name,
		disabled = false,
		invalid,
		validate,
		validationMode = 'onSubmit',
		validationDebounceTime = 0,
		dirty: dirtyProp = $bindable(undefined),
		defaultDirty = false,
		onDirtyChange,
		touched: touchedProp = $bindable(undefined),
		defaultTouched = false,
		onTouchedChange,
		class: className,
		style,
		id = useId('field'),
		children,
		...rest
	}: FieldRootProps = $props();

	const form = hasContext(FORM_CONTEXT) ? getContext<FormContext>(FORM_CONTEXT) : undefined;

	const controlId = useId('field-control');
	const labelId = useId('field-label');
	const descriptionId = useId('field-description');
	const errorId = useId('field-error');

	let value = $state('');
	let initialValue = $state<unknown>('');
	let initialized = $state(false);
	let touchedUncontrolled = $state(defaultTouched);
	let dirtyUncontrolled = $state(defaultDirty);
	const touched = $derived(touchedProp !== undefined ? touchedProp : touchedUncontrolled);
	const dirty = $derived(dirtyProp !== undefined ? dirtyProp : dirtyUncontrolled);
	let focused = $state(false);
	let validationErrors = $state<string[]>([]);
	let hasValidated = $state(false);
	let hasDescription = $state(false);
	let controlEl = $state<HTMLInputElement | null>(null);
	let nativeFlags = $state<FieldValidityFlags>({ ...DEFAULT_VALIDITY_FLAGS });
	/** True while an async `validate` is in flight and we published neutral validity. */
	let validating = $state(false);
	let validationCommitId = 0;
	let validateTimer: ReturnType<typeof setTimeout> | undefined;

	/** Tracks the message installed by Field and any foreign message it displaced. */
	let ownedCustomValidity: {
		el: HTMLInputElement;
		owned: string;
		displaced: string;
	} | null = null;

	const formError = $derived(name && form ? form.getFieldError(name) : undefined);

	const errors = $derived.by(() => {
		const list = [...validationErrors];
		if (formError && !list.includes(formError)) {
			list.push(formError);
		}
		return list;
	});

	const filled = $derived(value.length > 0);

	const validity = $derived.by((): FieldValidityFlags => {
		const hasExternalInvalid = invalid === true || Boolean(formError);

		if (validating && !hasExternalInvalid) {
			// Keep synchronous native failures; otherwise publish neutral while async runs.
			if (nativeFlags.valid === false && !nativeFlags.customError) {
				return { ...nativeFlags };
			}
			// Keep a prior custom error outside onSubmit mode (blocks UX flicker).
			if (validationMode !== 'onSubmit' && nativeFlags.customError && nativeFlags.valid === false) {
				return { ...nativeFlags };
			}
			return {
				...nativeFlags,
				valid: null,
			};
		}

		if (!hasValidated && !hasExternalInvalid) {
			return {
				...DEFAULT_VALIDITY_FLAGS,
				valid: invalid === false ? true : null,
			};
		}

		const flags: FieldValidityFlags = { ...nativeFlags };
		if (hasExternalInvalid) {
			flags.valid = false;
		} else if (invalid === false && flags.valid !== false) {
			flags.valid = true;
		} else if (!hasValidated) {
			flags.valid = false;
		}
		return flags;
	});

	const valid = $derived(validity.valid);

	function readNativeFlags(element: HTMLInputElement): FieldValidityFlags {
		const { validity: v } = element;
		return {
			badInput: v.badInput,
			customError: v.customError,
			patternMismatch: v.patternMismatch,
			rangeOverflow: v.rangeOverflow,
			rangeUnderflow: v.rangeUnderflow,
			stepMismatch: v.stepMismatch,
			tooLong: v.tooLong,
			tooShort: v.tooShort,
			typeMismatch: v.typeMismatch,
			valueMissing: v.valueMissing,
			valid: v.valid,
		};
	}

	function setOwnedCustomValidity(element: HTMLInputElement, message: string): void {
		const displaced = element.validity.customError ? element.validationMessage : '';
		const owned = message.replace(/\r\n?/g, '\n');
		element.setCustomValidity(owned);
		ownedCustomValidity = { el: element, owned, displaced };
		nativeFlags = readNativeFlags(element);
	}

	function clearOwnedCustomValidity(): void {
		const record = ownedCustomValidity;
		ownedCustomValidity = null;
		if (!record) return;
		// Only clear if still Field-owned (or barred so message is unreadable).
		if (!record.el.willValidate || record.el.validationMessage === record.owned) {
			record.el.setCustomValidity(record.displaced);
		}
	}

	function syncNativeValidity(element: HTMLInputElement): void {
		nativeFlags = readNativeFlags(element);
	}

	function setCustomValidity(message: string): void {
		if (!controlEl) return;
		if (message) {
			setOwnedCustomValidity(controlEl, message);
		} else {
			clearOwnedCustomValidity();
			if (controlEl) {
				nativeFlags = readNativeFlags(controlEl);
			}
		}
	}

	function registerControl(element: HTMLInputElement | null): void {
		if (controlEl && controlEl !== element) {
			clearOwnedCustomValidity();
		}
		controlEl = element;
		if (element) {
			syncNativeValidity(element);
		} else {
			nativeFlags = { ...DEFAULT_VALIDITY_FLAGS };
			// Cancel any in-flight validation when the control unregisters.
			validationCommitId += 1;
			validating = false;
		}
	}

	function normalizeValidateResult(
		result: string | string[] | null | undefined,
	): string[] {
		if (result === null || result === undefined) return [];
		return Array.isArray(result) ? result.filter(Boolean) : result ? [result] : [];
	}

	async function runValidate(): Promise<boolean> {
		validationCommitId += 1;
		const commitId = validationCommitId;
		hasValidated = true;
		const nextErrors: string[] = [];

		// Capture prior custom-error publish before clearing owned messages.
		const hadPriorCustomError = nativeFlags.customError && nativeFlags.valid === false;

		// Do not read Field's previous message back as a native constraint.
		clearOwnedCustomValidity();

		if (controlEl) {
			controlEl.checkValidity();
			const flags = readNativeFlags(controlEl);
			nativeFlags = flags;
			if (!flags.valid) {
				const message = controlEl.validationMessage;
				if (message) {
					nextErrors.push(message);
				}
			}
		} else {
			nativeFlags = { ...DEFAULT_VALIDITY_FLAGS, valid: true };
		}

		const nativeInvalid = nativeFlags.valid === false;

		if (validate && !nativeInvalid) {
			const resultOrPromise = validate(value);
			const isThenable =
				typeof resultOrPromise === 'object' &&
				resultOrPromise !== null &&
				'then' in resultOrPromise;

			if (isThenable) {
				const priorErrors = [...validationErrors];
				const priorFlags = { ...nativeFlags };

				// Publish neutral while awaiting, but keep prior custom error outside onSubmit.
				if (nativeFlags.valid === false) {
					validationErrors = nextErrors;
				} else if (validationMode === 'onSubmit' || !hadPriorCustomError) {
					validating = true;
					validationErrors = [];
				} else {
					// Restore published custom-error flags for the pending window.
					nativeFlags = {
						...priorFlags,
						customError: true,
						valid: false,
					};
					validationErrors = priorErrors;
				}

				let result: string | string[] | null;
				try {
					result = await resultOrPromise;
				} catch {
					validating = false;
					return false;
				}

				if (commitId !== validationCommitId) {
					return false;
				}
				validating = false;

				if (controlEl) {
					controlEl.checkValidity();
					nativeFlags = readNativeFlags(controlEl);
				}

				const customMessages = normalizeValidateResult(result);
				if (customMessages.length > 0) {
					nextErrors.length = 0;
					nextErrors.push(...customMessages);
					const message = customMessages.join('\n');
					if (controlEl?.willValidate) {
						setOwnedCustomValidity(controlEl, message);
						nativeFlags = {
							...readNativeFlags(controlEl),
							customError: true,
							valid: false,
						};
					} else {
						nativeFlags = {
							...DEFAULT_VALIDITY_FLAGS,
							customError: true,
							valid: false,
						};
					}
				} else if (controlEl) {
					nativeFlags = readNativeFlags(controlEl);
				}
			} else {
				const customMessages = normalizeValidateResult(resultOrPromise);
				if (customMessages.length > 0) {
					nextErrors.push(...customMessages);
					const message = customMessages.join('\n');
					if (controlEl?.willValidate) {
						setOwnedCustomValidity(controlEl, message);
						nativeFlags = {
							...readNativeFlags(controlEl),
							customError: true,
							valid: false,
						};
					} else {
						nativeFlags = {
							...DEFAULT_VALIDITY_FLAGS,
							customError: true,
							valid: false,
						};
					}
				} else if (controlEl) {
					nativeFlags = readNativeFlags(controlEl);
				}
			}
		} else {
			validating = false;
		}

		if (commitId !== validationCommitId) {
			return false;
		}

		validationErrors = nextErrors;

		const ok =
			validationErrors.length === 0 &&
			!formError &&
			invalid !== true &&
			nativeFlags.valid !== false;
		return ok;
	}

	function cancelPendingValidation(): void {
		if (validateTimer) {
			clearTimeout(validateTimer);
			validateTimer = undefined;
		}
		validationCommitId += 1;
		validating = false;
	}

	function scheduleValidate(): void {
		if (validationDebounceTime > 0) {
			if (validateTimer) clearTimeout(validateTimer);
			validationCommitId += 1;
			validateTimer = setTimeout(() => {
				void runValidate();
			}, validationDebounceTime);
			return;
		}
		void runValidate();
	}

	function setValue(next: string, event?: Event): void {
		if (!initialized) {
			initialized = true;
			initialValue = next;
			value = next;
			setDirty(false);
			return;
		}
		value = next;
		setDirty(next !== initialValue);
		if (name) form?.clearFieldError(name);
		if (validationMode === 'onChange' || (validationMode === 'onSubmit' && hasValidated)) {
			scheduleValidate();
		}
		void event;
	}

	/**
	 * Sync field state when a controlled control's value prop changes
	 * (programmatic clears, parent rewrites). Skips the initial mount path
	 * which goes through setValue via onMount.
	 */
	function syncControlledValue(next: string): void {
		if (!initialized) {
			initialized = true;
			initialValue = next;
			value = next;
			setDirty(false);
			return;
		}
		if (value === next) return;
		value = next;
		setDirty(next !== initialValue);
		if (name) form?.clearFieldError(name);
		if (validationMode === 'onChange' || (validationMode === 'onSubmit' && hasValidated)) {
			scheduleValidate();
		}
	}

	function setTouched(next: boolean): void {
		if (touchedProp !== undefined) {
			touchedProp = next;
		} else {
			touchedUncontrolled = next;
		}
		onTouchedChange?.(next);
		if (next && validationMode === 'onBlur') {
			void runValidate();
		}
	}

	function setFocused(next: boolean): void {
		focused = next;
	}

	function setDirty(next: boolean): void {
		if (dirtyProp !== undefined) {
			dirtyProp = next;
		} else {
			dirtyUncontrolled = next;
		}
		onDirtyChange?.(next);
	}

	function getDescribedBy(): string | undefined {
		const ids: string[] = [];
		if (hasDescription) ids.push(descriptionId);
		if (valid === false) ids.push(errorId);
		return ids.length > 0 ? ids.join(' ') : undefined;
	}

	$effect(() => {
		if (!form || !name) return;
		form.registerField(name, { validate: runValidate });
		return () => {
			form.unregisterField(name);
			cancelPendingValidation();
		};
	});

	setContext(FIELD_CONTEXT, {
		get name() {
			return name;
		},
		get controlId() {
			return controlId;
		},
		get labelId() {
			return labelId;
		},
		get descriptionId() {
			return descriptionId;
		},
		get errorId() {
			return errorId;
		},
		get disabled() {
			return disabled;
		},
		get value() {
			return value;
		},
		get initialValue() {
			return initialValue;
		},
		get touched() {
			return touched;
		},
		get dirty() {
			return dirty;
		},
		get focused() {
			return focused;
		},
		get filled() {
			return filled;
		},
		get valid() {
			return valid;
		},
		get errors() {
			return errors;
		},
		get validity() {
			return validity;
		},
		get validationMode() {
			return validationMode;
		},
		setValue,
		syncControlledValue,
		setTouched,
		setFocused,
		setDirty,
		registerControl,
		syncNativeValidity,
		setCustomValidity,
		validate: runValidate,
		getDescribedBy,
		setHasDescription: (next: boolean) => {
			hasDescription = next;
		},
	} satisfies FieldContext);

	const rootProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			class: className,
			style,
			'data-disabled': disabled ? '' : undefined,
			'data-valid': valid === true ? '' : undefined,
			'data-invalid': valid === false ? '' : undefined,
			'data-dirty': dirty ? '' : undefined,
			'data-touched': touched ? '' : undefined,
			'data-filled': filled ? '' : undefined,
			'data-focused': focused ? '' : undefined,
		}),
	);
</script>

<div {...rootProps} style={typeof rootProps.style === 'string' ? rootProps.style : undefined}>
	{#if children}
		{@render children({
			disabled,
			touched,
			dirty,
			focused,
			filled,
			valid,
		})}
	{/if}
</div>
