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
		type FieldValidityFlags
	} from './types.js';

	let {
		name,
		disabled = false,
		invalid,
		validate,
		validationMode = 'onSubmit',
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
	let touched = $state(false);
	let dirty = $state(false);
	let focused = $state(false);
	let validationErrors = $state<string[]>([]);
	let hasValidated = $state(false);
	let hasDescription = $state(false);
	let controlEl = $state<HTMLInputElement | null>(null);
	let nativeFlags = $state<FieldValidityFlags>({ ...DEFAULT_VALIDITY_FLAGS });

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

		if (!hasValidated && !hasExternalInvalid) {
			return {
				...DEFAULT_VALIDITY_FLAGS,
				valid: invalid === false ? true : null
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
			valid: v.valid
		};
	}

	function syncNativeValidity(element: HTMLInputElement): void {
		nativeFlags = readNativeFlags(element);
	}

	function setCustomValidity(message: string): void {
		if (!controlEl) return;
		controlEl.setCustomValidity(message);
		nativeFlags = readNativeFlags(controlEl);
	}

	function registerControl(element: HTMLInputElement | null): void {
		controlEl = element;
		if (element) {
			syncNativeValidity(element);
		} else {
			nativeFlags = { ...DEFAULT_VALIDITY_FLAGS };
		}
	}

	async function runValidate(): Promise<boolean> {
		hasValidated = true;
		const nextErrors: string[] = [];

		if (controlEl) {
			// Clear previous custom validity from our validate prop before re-checking native.
			controlEl.setCustomValidity('');
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
			const result = await validate(value);
			const customMessages =
				result === null || result === undefined
					? []
					: Array.isArray(result)
						? result.filter(Boolean)
						: [result];

			if (customMessages.length > 0) {
				nextErrors.push(...customMessages);
				const message = customMessages.join('\n');
				if (controlEl) {
					controlEl.setCustomValidity(message);
					nativeFlags = {
						...readNativeFlags(controlEl),
						customError: true,
						valid: false
					};
				} else {
					nativeFlags = {
						...DEFAULT_VALIDITY_FLAGS,
						customError: true,
						valid: false
					};
				}
			} else if (controlEl) {
				controlEl.setCustomValidity('');
				nativeFlags = readNativeFlags(controlEl);
			}
		}

		validationErrors = nextErrors;

		const ok =
			validationErrors.length === 0 &&
			!formError &&
			invalid !== true &&
			nativeFlags.valid !== false;
		return ok;
	}

	function setValue(next: string, event?: Event): void {
		if (!initialized) {
			initialized = true;
			initialValue = next;
			value = next;
			dirty = false;
			return;
		}
		value = next;
		dirty = next !== initialValue;
		if (name) form?.clearFieldError(name);
		if (validationMode === 'onChange' || (validationMode === 'onSubmit' && hasValidated)) {
			void runValidate();
		}
		void event;
	}

	function setTouched(next: boolean): void {
		touched = next;
		if (next && validationMode === 'onBlur') {
			void runValidate();
		}
	}

	function setFocused(next: boolean): void {
		focused = next;
	}

	function setDirty(next: boolean): void {
		dirty = next;
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
		}
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
			'data-focused': focused ? '' : undefined
		})
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
			valid
		})}
	{/if}
</div>
