<script lang="ts">
	import { getContext } from 'svelte';
	import { TABS_CONTEXT } from '../internal/context-keys.js';
	import { mergeProps } from '../internal/merge-props.js';
	import type { TabsContext, TabsIndicatorProps } from './types.js';

	type TabEntry = {
		id: string;
		value: string;
		element: HTMLElement;
	};

	type TabsContextInternal = TabsContext & {
		readonly listElement: HTMLElement | null;
		getTabs: () => TabEntry[];
	};

	let { class: className, style, children, ...rest }: TabsIndicatorProps = $props();

	const ctx = getContext<TabsContextInternal>(TABS_CONTEXT);

	let left = $state(0);
	let top = $state(0);
	let width = $state(0);
	let height = $state(0);
	let ready = $state(false);

	function measure(): void {
		const list = ctx.listElement;
		const tab = ctx.getTabs().find((entry) => entry.value === ctx.value)?.element;
		if (!list || !tab) {
			ready = false;
			return;
		}

		const listRect = list.getBoundingClientRect();
		const tabRect = tab.getBoundingClientRect();

		left = tabRect.left - listRect.left + list.scrollLeft;
		top = tabRect.top - listRect.top + list.scrollTop;
		width = tab.offsetWidth || tabRect.width;
		height = tab.offsetHeight || tabRect.height;
		ready = true;
	}

	$effect(() => {
		void ctx.value;
		void ctx.listElement;
		void ctx.getTabs().length;

		measure();

		const list = ctx.listElement;
		const tab = ctx.getTabs().find((entry) => entry.value === ctx.value)?.element;
		if (!list || !tab || typeof ResizeObserver === 'undefined') {
			return;
		}

		const observer = new ResizeObserver(() => {
			measure();
		});
		observer.observe(list);
		observer.observe(tab);

		const onScroll = (): void => {
			measure();
		};
		list.addEventListener('scroll', onScroll, { passive: true });

		return () => {
			observer.disconnect();
			list.removeEventListener('scroll', onScroll);
		};
	});

	const cssVars = $derived(
		ready
			? [
					`--active-tab-left: ${left}px`,
					`--active-tab-top: ${top}px`,
					`--active-tab-right: ${Math.max(0, (ctx.listElement?.scrollWidth ?? 0) - left - width)}px`,
					`--active-tab-bottom: ${Math.max(0, (ctx.listElement?.scrollHeight ?? 0) - top - height)}px`,
					`--active-tab-width: ${width}px`,
					`--active-tab-height: ${height}px`,
				].join('; ')
			: '',
	);

	const mergedStyle = $derived(
		[cssVars, typeof style === 'string' ? style : ''].filter(Boolean).join('; ') || undefined,
	);

	const mergedProps: Record<string, unknown> = $derived(
		mergeProps(rest, {
			role: 'presentation',
			class: className,
			style: mergedStyle,
			hidden: !ready ? true : undefined,
			'data-orientation': ctx.orientation,
		}),
	);
</script>

<span
	{...mergedProps}
	style={typeof mergedProps.style === 'string' ? mergedProps.style : undefined}
>
	{#if children}
		{@render children()}
	{/if}
</span>
