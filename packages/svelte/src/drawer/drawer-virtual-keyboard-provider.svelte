<script lang="ts">
	import { onDestroy, setContext } from 'svelte';
	import { DRAWER_VIRTUAL_KEYBOARD_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import { isFocusableField } from './swipe-utils.js';
	import type {
		DrawerVirtualKeyboardContext,
		DrawerVirtualKeyboardProviderProps
	} from './types.js';

	let {
		class: className,
		style,
		children,
		...rest
	}: DrawerVirtualKeyboardProviderProps = $props();

	let keyboardInset = $state(0);
	let wrapperEl = $state<HTMLElement | null>(null);
	let scrollTimer: ReturnType<typeof setTimeout> | undefined;
	let lastFocused: HTMLElement | null = null;

	const keyboardOpen = $derived(keyboardInset > 0);

	function computeInset(): number {
		if (typeof window === 'undefined') return 0;
		const vv = window.visualViewport;
		if (!vv) return 0;
		return Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
	}

	function updateInset(): void {
		keyboardInset = computeInset();
		if (lastFocused && keyboardInset > 0) {
			scheduleScrollIntoView(lastFocused);
		}
	}

	function scheduleScrollIntoView(el: HTMLElement): void {
		if (scrollTimer !== undefined) {
			clearTimeout(scrollTimer);
		}
		scrollTimer = setTimeout(() => {
			el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
			scrollTimer = undefined;
		}, 50);
	}

	function onFocusIn(event: FocusEvent): void {
		if (!isFocusableField(event.target)) return;
		lastFocused = event.target;
		scheduleScrollIntoView(event.target);
	}

	function onFocusOut(event: FocusEvent): void {
		const next = event.relatedTarget;
		if (next instanceof Node && wrapperEl?.contains(next)) return;
		lastFocused = null;
	}

	$effect(() => {
		if (typeof window === 'undefined') return;
		const vv = window.visualViewport;
		updateInset();
		window.addEventListener('resize', updateInset);
		vv?.addEventListener('resize', updateInset);
		vv?.addEventListener('scroll', updateInset);
		return () => {
			window.removeEventListener('resize', updateInset);
			vv?.removeEventListener('resize', updateInset);
			vv?.removeEventListener('scroll', updateInset);
		};
	});

	onDestroy(() => {
		if (scrollTimer !== undefined) {
			clearTimeout(scrollTimer);
		}
	});

	setContext(DRAWER_VIRTUAL_KEYBOARD_CONTEXT, {
		get keyboardInset() {
			return keyboardInset;
		},
		get keyboardOpen() {
			return keyboardOpen;
		}
	} satisfies DrawerVirtualKeyboardContext);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			class: className,
			style: [
				`--drawer-keyboard-inset:${keyboardInset}px`,
				typeof style === 'string' ? style : undefined
			]
				.filter(Boolean)
				.join(';'),
			'data-keyboard-open': keyboardOpen ? '' : undefined,
			onfocusin: onFocusIn,
			onfocusout: onFocusOut
		})
	);
</script>

<div
	{...mergedProps}
	bind:this={wrapperEl}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
>
	{#if children}
		{@render children()}
	{/if}
</div>
