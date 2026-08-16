<script lang="ts">
	import '../app.css';
	import { ScrollArea } from 'base-ui-svelte/scroll-area';
	import BrandMark from '$lib/BrandMark.svelte';
	import Sidebar from '$lib/Sidebar.svelte';
	import ThemeToggle from '$lib/ThemeToggle.svelte';
	import GitHubLink from '$lib/GitHubLink.svelte';

	let { children } = $props();

	let menuOpen = $state(false);
	let isNarrow = $state(false);
	let menuToggleEl: HTMLButtonElement | undefined = $state();
	let sidebarEl: HTMLElement | undefined = $state();

	const drawerActive = $derived(isNarrow && menuOpen);

	function closeMenu(): void {
		if (!menuOpen) return;
		menuOpen = false;
		queueMicrotask(() => menuToggleEl?.focus());
	}

	function openMenu(): void {
		menuOpen = true;
		queueMicrotask(() => {
			const first = sidebarEl?.querySelector<HTMLElement>('a, button');
			first?.focus();
		});
	}

	function toggleMenu(): void {
		if (menuOpen) closeMenu();
		else openMenu();
	}

	function onKeydown(event: KeyboardEvent): void {
		if (event.key === 'Escape' && drawerActive) {
			event.preventDefault();
			closeMenu();
		}
	}

	$effect(() => {
		const mq = window.matchMedia('(max-width: 899px)');
		const sync = (): void => {
			isNarrow = mq.matches;
			if (!mq.matches) menuOpen = false;
		};
		sync();
		mq.addEventListener('change', sync);
		return () => mq.removeEventListener('change', sync);
	});
</script>

<svelte:window onkeydown={onKeydown} />

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<a class="skip-link" href="#main">Skip to content</a>

<div class="docs-shell" class:menu-open={drawerActive}>
	<header class="mobile-bar">
		<button
			bind:this={menuToggleEl}
			type="button"
			class="menu-toggle"
			aria-expanded={drawerActive}
			aria-controls="docs-sidebar"
			onclick={toggleMenu}
		>
			{drawerActive ? 'Close menu' : 'Open menu'}
		</button>
		<a href="/" class="mobile-brand" onclick={closeMenu}>
			<BrandMark />
			<span>base-ui-svelte</span>
		</a>
		<div class="chrome-actions">
			<ThemeToggle />
			<GitHubLink />
		</div>
	</header>

	{#if drawerActive}
		<button type="button" class="sidebar-backdrop" aria-label="Close menu" onclick={closeMenu}
		></button>
	{/if}

	<aside
		bind:this={sidebarEl}
		id="docs-sidebar"
		class="sidebar"
		inert={isNarrow && !menuOpen ? true : undefined}
	>
		<div class="sidebar-brand">
			<div class="sidebar-brand-row">
				<a href="/" class="brand-link" onclick={closeMenu}>
					<BrandMark />
					<span>base-ui-svelte</span>
				</a>
				<div class="chrome-actions desktop-only">
					<ThemeToggle />
					<GitHubLink />
				</div>
			</div>
			<p class="sidebar-tag">Unofficial Base UI port for Svelte 5</p>
		</div>
		<ScrollArea.Root class="sidebar-scroll">
			<ScrollArea.Viewport class="sidebar-scroll-viewport">
				<ScrollArea.Content>
					<Sidebar onNavigate={closeMenu} />
				</ScrollArea.Content>
			</ScrollArea.Viewport>
			<ScrollArea.Scrollbar class="sidebar-scrollbar" orientation="vertical">
				<ScrollArea.Thumb class="sidebar-scrollbar-thumb" />
			</ScrollArea.Scrollbar>
		</ScrollArea.Root>
	</aside>

	<main id="main" class="docs-main" inert={drawerActive ? true : undefined}>
		<div class="docs-content">
			{@render children()}
		</div>
	</main>
</div>

<style>
	:global(:root) {
		--docs-fg: #151a21;
		--docs-fg-muted: #4a5560;
		--docs-bg: #f4f2ee;
		--docs-surface: #ffffff;
		--docs-sidebar: #faf9f7;
		--docs-border: color-mix(in srgb, #151a21 10%, transparent);
		--docs-border-strong: color-mix(in srgb, #151a21 16%, transparent);
		--docs-accent: #0052cc;
		--docs-accent-soft: color-mix(in srgb, #0052cc 10%, #fff);
		--docs-focus: #0052cc;
		--docs-overlay: color-mix(in srgb, #151a21 40%, transparent);
		--docs-shadow: color-mix(in srgb, #151a21 12%, transparent);
		--docs-code-inline-bg: color-mix(in srgb, #151a21 6%, #fff);
		--docs-hover-bg: color-mix(in srgb, #151a21 5%, transparent);
		--docs-demo-bg: color-mix(in srgb, var(--docs-bg) 55%, #fff);
		--docs-radius: 0.5rem;
		--docs-sidebar-width: 16.75rem;
		--docs-sidebar-scrollbar-width: 0.875rem;
		--docs-sidebar-scrollbar-thumb: 0.25rem;
		--docs-scrollbar-size: 0.7rem;
		--docs-scrollbar-thumb: color-mix(in srgb, var(--docs-fg) 22%, transparent);
		--docs-scrollbar-thumb-hover: color-mix(in srgb, var(--docs-fg) 40%, transparent);
		--docs-scrollbar-thumb-active: color-mix(in srgb, var(--docs-fg) 52%, transparent);
		--font-sans: 'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif;
		--font-mono: 'IBM Plex Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
	}

	:global(html.dark) {
		--docs-fg: #e8ecf1;
		--docs-fg-muted: #9aa3ad;
		--docs-bg: #0f1318;
		--docs-surface: #171c22;
		--docs-sidebar: #12171d;
		--docs-border: color-mix(in srgb, #e8ecf1 12%, transparent);
		--docs-border-strong: color-mix(in srgb, #e8ecf1 18%, transparent);
		--docs-accent: #6ea8ff;
		--docs-accent-soft: color-mix(in srgb, #6ea8ff 16%, transparent);
		--docs-focus: #6ea8ff;
		--docs-overlay: color-mix(in srgb, #000 55%, transparent);
		--docs-shadow: color-mix(in srgb, #000 45%, transparent);
		--docs-code-inline-bg: color-mix(in srgb, #e8ecf1 10%, transparent);
		--docs-hover-bg: color-mix(in srgb, #e8ecf1 7%, transparent);
		--docs-demo-bg: color-mix(in srgb, var(--docs-bg) 40%, var(--docs-surface));
	}

	:global(html) {
		scrollbar-gutter: stable;
	}

	:global(*) {
		scrollbar-width: thin;
		scrollbar-color: var(--docs-scrollbar-thumb) transparent;
	}

	:global(*::-webkit-scrollbar) {
		width: var(--docs-scrollbar-size);
		height: var(--docs-scrollbar-size);
	}

	:global(*::-webkit-scrollbar-track) {
		background: transparent;
	}

	:global(*::-webkit-scrollbar-thumb) {
		background-color: var(--docs-scrollbar-thumb);
		border-radius: 999px;
		border: 3px solid transparent;
		background-clip: content-box;
	}

	:global(*::-webkit-scrollbar-thumb:hover) {
		background-color: var(--docs-scrollbar-thumb-hover);
	}

	:global(*::-webkit-scrollbar-thumb:active) {
		background-color: var(--docs-scrollbar-thumb-active);
	}

	:global(*::-webkit-scrollbar-corner) {
		background: transparent;
	}

	:global(body) {
		position: relative;
		margin: 0;
		font-family: var(--font-sans);
		background: var(--docs-bg);
		color: var(--docs-fg);
		min-height: 100vh;
		-webkit-font-smoothing: antialiased;
		text-rendering: optimizeLegibility;
	}

	:global(.root) {
		isolation: isolate;
		min-height: 100vh;
	}

	:global(:focus-visible) {
		outline: 2px solid var(--docs-focus);
		outline-offset: 2px;
	}

	.skip-link {
		position: absolute;
		inset-inline-start: -9999px;
		top: 0.75rem;
		z-index: 100;
		padding: 0.5rem 0.85rem;
		border-radius: 0.35rem;
		background: var(--docs-surface);
		color: var(--docs-fg);
		font-weight: 600;
		font-size: 0.875rem;
		text-decoration: none;
		border: 1px solid var(--docs-border-strong);
		box-shadow: 0 4px 16px var(--docs-shadow);
	}

	.skip-link:focus {
		inset-inline-start: 0.75rem;
	}

	.docs-shell {
		display: grid;
		grid-template-columns: 1fr;
		min-height: 100vh;
	}

	.mobile-bar {
		position: sticky;
		top: 0;
		z-index: 30;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		min-height: 3.25rem;
		padding: 0.5rem 1rem;
		background: color-mix(in srgb, var(--docs-surface) 92%, transparent);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid var(--docs-border);
	}

	.menu-toggle {
		font: inherit;
		font-size: 0.875rem;
		font-weight: 600;
		min-height: 2.5rem;
		min-width: 2.5rem;
		padding: 0.4rem 0.75rem;
		border: 1px solid var(--docs-border-strong);
		border-radius: 0.4rem;
		background: var(--docs-surface);
		color: inherit;
		cursor: pointer;
	}

	.menu-toggle:hover {
		background: var(--docs-bg);
	}

	.mobile-brand {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 700;
		letter-spacing: -0.03em;
		color: inherit;
		text-decoration: none;
		margin-inline-end: auto;
	}

	.chrome-actions {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.desktop-only {
		display: none;
	}

	.sidebar-backdrop {
		position: fixed;
		inset: 0;
		z-index: 35;
		border: 0;
		padding: 0;
		background: var(--docs-overlay);
		cursor: pointer;
	}

	.sidebar {
		position: fixed;
		inset: 0 auto 0 0;
		z-index: 40;
		display: flex;
		flex-direction: column;
		width: min(var(--docs-sidebar-width), 88vw);
		overflow: hidden;
		padding: 1.25rem 0 0;
		background: var(--docs-sidebar);
		border-right: 1px solid var(--docs-border);
		transform: translateX(-105%);
		box-shadow: 4px 0 24px var(--docs-shadow);
	}

	.sidebar :global(.sidebar-scroll) {
		flex: 1;
		min-height: 0;
	}

	.sidebar :global(.sidebar-scroll-viewport) {
		height: 100%;
		padding: 0 0.85rem 2.5rem;
		overscroll-behavior: contain;
		outline: none;
	}

	.sidebar :global(.sidebar-scrollbar) {
		display: flex;
		width: var(--docs-sidebar-scrollbar-width);
		padding-block: 0.25rem;
		opacity: 0;
		pointer-events: none;
	}

	@media (prefers-reduced-motion: no-preference) {
		.sidebar :global(.sidebar-scrollbar) {
			transition: opacity 200ms 500ms;
		}
	}

	.sidebar :global(.sidebar-scroll:hover .sidebar-scrollbar),
	.sidebar :global(.sidebar-scrollbar:active),
	.sidebar :global(.sidebar-scrollbar[data-scrolling]),
	.sidebar :global(.sidebar-scroll-viewport:focus-visible + .sidebar-scrollbar) {
		opacity: 1;
		pointer-events: auto;
	}

	@media (prefers-reduced-motion: no-preference) {
		.sidebar :global(.sidebar-scroll:hover .sidebar-scrollbar),
		.sidebar :global(.sidebar-scrollbar:active),
		.sidebar :global(.sidebar-scrollbar[data-scrolling]),
		.sidebar :global(.sidebar-scroll-viewport:focus-visible + .sidebar-scrollbar) {
			transition-duration: 0ms;
			transition-delay: 0ms;
		}
	}

	.sidebar :global(.sidebar-scrollbar-thumb) {
		display: flex;
		justify-content: center;
		width: 100%;
	}

	.sidebar :global(.sidebar-scrollbar-thumb::before) {
		content: '';
		display: block;
		width: var(--docs-sidebar-scrollbar-thumb);
		height: 100%;
		border-radius: 999px;
		background-color: var(--docs-scrollbar-thumb);
	}

	.sidebar :global(.sidebar-scrollbar-thumb:hover::before) {
		background-color: var(--docs-scrollbar-thumb-hover);
	}

	.sidebar :global(.sidebar-scrollbar-thumb:active::before) {
		background-color: var(--docs-scrollbar-thumb-active);
	}

	@media (prefers-reduced-motion: no-preference) {
		.sidebar {
			transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1);
		}
	}

	.docs-shell.menu-open .sidebar {
		transform: translateX(0);
	}

	.sidebar-brand {
		flex-shrink: 0;
		margin-bottom: 1.35rem;
		padding: 0.15rem 1.4rem 1rem;
		border-bottom: 1px solid var(--docs-border);
	}

	.sidebar-brand-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.brand-link {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		font-size: 1.05rem;
		font-weight: 700;
		letter-spacing: -0.03em;
		color: inherit;
		text-decoration: none;
	}

	.brand-link:hover {
		color: var(--docs-accent);
	}

	.sidebar-tag {
		margin: 0.4rem 0 0;
		font-size: 0.78rem;
		line-height: 1.4;
		color: var(--docs-fg-muted);
	}

	.docs-main {
		padding: 1rem;
		min-width: 0;
	}

	.docs-content {
		max-width: 50rem;
		margin: 0 auto;
	}

	@media (min-width: 900px) {
		.docs-shell {
			grid-template-columns: var(--docs-sidebar-width) 1fr;
		}

		.mobile-bar,
		.sidebar-backdrop {
			display: none;
		}

		.desktop-only {
			display: flex;
		}

		.sidebar {
			position: sticky;
			top: 0;
			height: 100vh;
			width: auto;
			transform: none;
			z-index: 1;
			box-shadow: none;
		}

		.sidebar-brand {
			padding-inline: 1.3rem 1.2rem;
		}

		.sidebar :global(.sidebar-scroll-viewport) {
			padding-inline: 0.75rem 0.65rem;
		}

		.docs-main {
			padding: 1.75rem 2rem 3.5rem;
		}
	}

	@media (min-width: 1200px) {
		.docs-main {
			padding-inline: 2.75rem;
		}
	}
</style>
