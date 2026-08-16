<script lang="ts">
	import { setContext } from 'svelte';
	import { useId } from '../internal/controllable.svelte.js';
	import { FORM_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { FormContext, FormErrors, FormFieldRegistration, FormProps } from './types.js';

	let {
		errors = {},
		onFormSubmit,
		class: className,
		style,
		id = useId('form'),
		children,
		...rest
	}: FormProps = $props();

	/** Maps field name → error signature that was dismissed by typing. */
	let dismissed = $state<Record<string, string>>({});
	const registeredFields = new Map<string, FormFieldRegistration>();

	function errorSignature(value: string | string[] | undefined): string {
		if (value === undefined) return '';
		return Array.isArray(value) ? value.join('\0') : value;
	}

	const visibleErrors = $derived.by(() => {
		const next: FormErrors = {};
		for (const [key, value] of Object.entries(errors)) {
			if (dismissed[key] !== errorSignature(value)) {
				next[key] = value;
			}
		}
		return next;
	});

	function getFieldError(name: string): string | undefined {
		const value = visibleErrors[name];
		if (value === undefined) return undefined;
		return Array.isArray(value) ? value[0] : value;
	}

	function clearFieldError(name: string): void {
		const value = errors[name];
		if (value === undefined) return;
		dismissed = { ...dismissed, [name]: errorSignature(value) };
	}

	function registerField(name: string, registration: FormFieldRegistration): void {
		registeredFields.set(name, registration);
	}

	function unregisterField(name: string): void {
		registeredFields.delete(name);
	}

	setContext(FORM_CONTEXT, {
		get errors() {
			return visibleErrors;
		},
		getFieldError,
		clearFieldError,
		registerField,
		unregisterField,
	} satisfies FormContext);

	async function handleSubmit(event: SubmitEvent): Promise<void> {
		const formEl = event.currentTarget as HTMLFormElement;
		const fields = Array.from(registeredFields.values());
		const shouldIntercept = fields.length > 0 || Boolean(onFormSubmit);

		if (shouldIntercept) {
			event.preventDefault();
		}

		if (fields.length > 0) {
			const results = await Promise.all(fields.map((field) => field.validate()));
			if (results.some((ok) => !ok)) {
				return;
			}
		}

		if (onFormSubmit) {
			onFormSubmit(new FormData(formEl), event);
		}
	}

	const rootProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			class: className,
			style,
			novalidate: true,
			onsubmit: handleSubmit,
		}),
	);
</script>

<form {...rootProps} style={typeof rootProps.style === 'string' ? rootProps.style : undefined}>
	{#if children}
		{@render children()}
	{/if}
</form>
