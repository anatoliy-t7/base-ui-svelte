<script lang="ts">
	import { getContext } from 'svelte';
	import { TOAST_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { ToastContext, ToastViewportProps } from './types.js';

	let { class: className, style, children, ...rest }: ToastViewportProps = $props();

	const ctx = getContext<ToastContext>(TOAST_CONTEXT);

	let viewportEl = $state<HTMLElement | null>(null);
	let markedReadyForMouseLeave = false;

	const frontmostHeight = $derived(ctx.getFrontmostHeight());
	const expanded = $derived(ctx.expanded);
	const hasEndingToasts = $derived(ctx.toasts.some((toast) => toast.transitionStatus === 'ending'));

	function flushMouseLeave(): void {
		if (hasEndingToasts || !markedReadyForMouseLeave) return;
		ctx.setHovering(false);
		markedReadyForMouseLeave = false;
	}

	$effect(() => {
		hasEndingToasts;
		flushMouseLeave();
	});

	$effect(() => {
		if (!viewportEl || ctx.toasts.length === 0) return;

		function handleWindowBlur(event: FocusEvent): void {
			if (event.target !== window) return;
			ctx.setWindowFocused(false);
		}

		function handleWindowFocus(event: FocusEvent): void {
			if (event.relatedTarget) return;
			ctx.setWindowFocused(true);
		}

		function handleGlobalKeyDown(event: KeyboardEvent): void {
			if (event.key !== 'F6' || event.target === viewportEl) return;
			event.preventDefault();
			viewportEl?.focus({ preventScroll: true });
			ctx.pauseTimers();
			ctx.setFocused(true);
		}

		window.addEventListener('blur', handleWindowBlur, true);
		window.addEventListener('focus', handleWindowFocus, true);
		window.addEventListener('keydown', handleGlobalKeyDown);

		return () => {
			window.removeEventListener('blur', handleWindowBlur, true);
			window.removeEventListener('focus', handleWindowFocus, true);
			window.removeEventListener('keydown', handleGlobalKeyDown);
		};
	});

	const cssVars = $derived(frontmostHeight ? `--toast-frontmost-height: ${frontmostHeight}px` : '');

	const mergedStyle = $derived(
		[cssVars, typeof style === 'string' ? style : ''].filter(Boolean).join('; ') || undefined,
	);

	const viewportProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			role: 'region',
			tabindex: -1,
			'aria-live': 'polite',
			'aria-atomic': false,
			'aria-relevant': 'additions text',
			'aria-label': 'Notifications',
			class: className,
			style: mergedStyle,
			'data-expanded': expanded ? '' : undefined,
			onmouseenter: () => {
				markedReadyForMouseLeave = false;
				ctx.setHovering(true);
			},
			onmousemove: () => {
				markedReadyForMouseLeave = false;
				ctx.setHovering(true);
			},
			onmouseleave: () => {
				markedReadyForMouseLeave = true;
				flushMouseLeave();
			},
			onfocusin: () => {
				ctx.setFocused(true);
			},
			onfocusout: (event: FocusEvent) => {
				const next = event.relatedTarget;
				if (next instanceof Node && viewportEl?.contains(next)) return;
				ctx.setFocused(false);
			},
		}),
	);
</script>

<div
	{...viewportProps}
	bind:this={viewportEl}
	style={typeof viewportProps.style === 'string' ? viewportProps.style : undefined}
>
	{#if children}
		{@render children()}
	{/if}
</div>
