<script lang="ts">
	import { getContext, hasContext, setContext } from 'svelte';
	import { useId } from '../internal/controllable.svelte.js';
	import { FIELD_CONTEXT, FORM_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { FormContext } from '../form/types.js';
	import type { FieldContext, FieldRootProps } from './types.js';

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
	let initialValue = $state('');
	let initialized = $state(false);
	let touched = $state(false);
	let dirty = $state(false);
	let focused = $state(false);
	let validationErrors = $state<string[]>([]);
	let hasValidated = $state(false);
	let hasDescription = $state(false);

	const formError = $derived(name && form ? form.getFieldError(name) : undefined);

	const errors = $derived.by(() => {
		const list = [...validationErrors];
		if (formError && !list.includes(formError)) {
			list.push(formError);
		}
		return list;
	});

	const filled = $derived(value.length > 0);

	const valid = $derived.by(() => {
		if (invalid === true) return false;
		if (errors.length > 0) return false;
		if (invalid === false) return true;
		if (!hasValidated && !formError) return null;
		return true;
	});

	async function runValidate(): Promise<boolean> {
		hasValidated = true;
		if (!validate) {
			validationErrors = [];
			return invalid !== true && !formError;
		}
		const result = await validate(value);
		if (result === null || result === undefined) {
			validationErrors = [];
		} else if (Array.isArray(result)) {
			validationErrors = result;
		} else {
			validationErrors = [result];
		}
		return validationErrors.length === 0 && !formError && invalid !== true;
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
		get validationMode() {
			return validationMode;
		},
		setValue,
		setTouched,
		setFocused,
		setDirty,
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
