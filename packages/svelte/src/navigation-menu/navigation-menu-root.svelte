<script lang="ts">
	import { onDestroy, setContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import { useId } from '../internal/controllable.svelte.js';
	import { NAVIGATION_MENU_CONTEXT } from '../internal/context-keys.js';
	import { createPresence } from '../internal/presence.svelte.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type {
		NavigationMenuContext,
		NavigationMenuRefs,
		NavigationMenuRootProps
	} from './types.js';

	let {
		value = $bindable(undefined),
		defaultValue = null,
		onValueChange,
		orientation = 'horizontal',
		delay = 200,
		closeDelay = 150,
		class: className,
		style,
		id: idProp,
		children,
		...rest
	}: NavigationMenuRootProps = $props();

	const fallbackId = useId('navigation-menu');
	const id = $derived(idProp ?? fallbackId);

	let uncontrolled = $state<string | null | undefined>(undefined);

	const isControlled = $derived(value !== undefined);
	const currentValue = $derived.by(() => {
		if (isControlled) {
			return value ?? null;
		}
		return uncontrolled === undefined ? defaultValue : uncontrolled;
	});

	const open = $derived(currentValue != null);
	const presence = createPresence(() => open);

	const refs: NavigationMenuRefs = {
		list: null,
		popup: null,
		positioner: null,
		arrow: null,
		triggers: new Map()
	};

	const popupId = useId('navigation-menu-popup');

	const contents = new SvelteMap<string, Snippet>();
	let openTimeout: ReturnType<typeof setTimeout> | null = null;
	let closeTimeout: ReturnType<typeof setTimeout> | null = null;

	function setValue(next: string | null): void {
		if (isControlled) {
			value = next;
		} else {
			uncontrolled = next;
		}
		onValueChange?.(next);
	}

	function cancelOpen(): void {
		if (openTimeout != null) {
			clearTimeout(openTimeout);
			openTimeout = null;
		}
	}

	function cancelClose(): void {
		if (closeTimeout != null) {
			clearTimeout(closeTimeout);
			closeTimeout = null;
		}
	}

	function openItem(itemValue: string): void {
		cancelClose();
		cancelOpen();
		setValue(itemValue);
	}

	function close(): void {
		cancelOpen();
		cancelClose();
		setValue(null);
	}

	function openWithDelay(itemValue: string): void {
		cancelClose();
		cancelOpen();
		if (open || delay <= 0) {
			setValue(itemValue);
			return;
		}
		openTimeout = setTimeout(() => {
			openTimeout = null;
			setValue(itemValue);
		}, delay);
	}

	function closeWithDelay(): void {
		cancelOpen();
		cancelClose();
		if (closeDelay <= 0) {
			setValue(null);
			return;
		}
		closeTimeout = setTimeout(() => {
			closeTimeout = null;
			setValue(null);
		}, closeDelay);
	}

	function registerContent(itemValue: string, content: Snippet): () => void {
		contents.set(itemValue, content);
		return () => {
			contents.delete(itemValue);
		};
	}

	function getContent(itemValue: string): Snippet | undefined {
		return contents.get(itemValue);
	}

	function registerTrigger(itemValue: string, element: HTMLElement): () => void {
		refs.triggers.set(itemValue, element);
		return () => {
			if (refs.triggers.get(itemValue) === element) {
				refs.triggers.delete(itemValue);
			}
		};
	}

	onDestroy(() => {
		cancelOpen();
		cancelClose();
	});

	setContext(NAVIGATION_MENU_CONTEXT, {
		get value() {
			return currentValue;
		},
		setValue,
		get orientation() {
			return orientation;
		},
		get open() {
			return open;
		},
		presence,
		refs,
		get rootId() {
			return id;
		},
		popupId,
		registerContent,
		getContent,
		registerTrigger,
		openItem,
		close,
		get openDelay() {
			return delay;
		},
		get closeDelay() {
			return closeDelay;
		},
		openWithDelay,
		closeWithDelay,
		cancelClose
	} satisfies NavigationMenuContext);

	const rootProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			id,
			class: className,
			style,
			'data-orientation': orientation,
			'data-open': open ? '' : undefined,
			'data-closed': !open ? '' : undefined
		})
	);
</script>

<nav {...rootProps} style={typeof rootProps.style === 'string' ? rootProps.style : undefined}>
	{#if children}
		{@render children({ value: currentValue, open })}
	{/if}
</nav>
