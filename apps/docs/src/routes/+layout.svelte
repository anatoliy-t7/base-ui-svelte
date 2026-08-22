<script lang="ts">
	import '@fontsource/inter/400.css';
	import '@fontsource/inter/400-italic.css';
	import '@fontsource/inter/500.css';
	import '@fontsource/inter/600.css';
	import '@fontsource/inter/700.css';
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
	<script
		defer
		src="https://stats.t7t.app/script.js"
		data-website-id="9aa36b1d-429a-4dee-9216-ada9204835e7"
	></script>
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
					<span style="color: #ff3e00;">b</span>ase-ui-svelte
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
