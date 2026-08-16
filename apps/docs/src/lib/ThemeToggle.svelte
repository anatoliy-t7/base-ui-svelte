<script lang="ts">
	import { onMount } from 'svelte';
	import {
		applyTheme,
		getSystemTheme,
		readStoredTheme,
		THEME_STORAGE_KEY,
		type ResolvedTheme,
		type ThemePreference
	} from './theme.js';

	let preference = $state<ThemePreference>('system');
	let systemTheme = $state<ResolvedTheme>('light');
	let ready = $state(false);

	const resolved = $derived(preference === 'system' ? systemTheme : preference);
	const label = $derived(resolved === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');

	$effect(() => {
		if (!ready) return;
		applyTheme(preference);
	});

	onMount(() => {
		preference = readStoredTheme();
		systemTheme = getSystemTheme();
		ready = true;

		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		const onSystemChange = (): void => {
			systemTheme = getSystemTheme();
		};
		mq.addEventListener('change', onSystemChange);
		return () => mq.removeEventListener('change', onSystemChange);
	});

	function toggle(): void {
		const next: ThemePreference = resolved === 'dark' ? 'light' : 'dark';
		preference = next;
		localStorage.setItem(THEME_STORAGE_KEY, next);
	}
</script>

<button
	type="button"
	class="theme-toggle"
	aria-label={label}
	title={label}
	onclick={toggle}
	disabled={!ready}
>
	{#if resolved === 'dark'}
		<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
			<path
				fill="currentColor"
				d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12Zm0-16a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm0 18a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1ZM4.22 4.22a1 1 0 0 1 1.42 0l.7.7A1 1 0 1 1 4.92 7.7l-.7-.7a1 1 0 0 1 0-1.42Zm14.14 14.14a1 1 0 0 1 1.42 0l.7.7a1 1 0 1 1-1.42 1.42l-.7-.7a1 1 0 0 1 0-1.42ZM3 12a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Zm17 0a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1ZM4.22 19.78a1 1 0 0 1 0-1.42l.7-.7a1 1 0 1 1 1.42 1.42l-.7.7a1 1 0 0 1-1.42 0Zm14.14-14.14a1 1 0 0 1 0-1.42l.7-.7a1 1 0 1 1 1.42 1.42l-.7.7a1 1 0 0 1-1.42 0Z"
			/>
		</svg>
	{:else}
		<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
			<path
				fill="currentColor"
				d="M12.1 22c-5.1-.3-9.2-4.5-9.1-9.6.1-4.6 3.4-8.4 7.8-9.3.5-.1.9.4.7.9A7.5 7.5 0 0 0 19 15.4c.4-.1.9.3.8.8-.8 3.7-4.1 6.3-7.7 6.8Z"
			/>
		</svg>
	{/if}
</button>

<style>
	.theme-toggle {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.25rem;
		height: 2.25rem;
		padding: 0;
		border: 1px solid var(--docs-border-strong);
		border-radius: 0.4rem;
		background: var(--docs-surface);
		color: var(--docs-fg-muted);
		cursor: pointer;
	}

	.theme-toggle:hover:not(:disabled) {
		color: var(--docs-fg);
		background: var(--docs-bg);
	}

	.theme-toggle:disabled {
		opacity: 0.6;
		cursor: default;
	}

	.icon {
		width: 1.05rem;
		height: 1.05rem;
	}
</style>
