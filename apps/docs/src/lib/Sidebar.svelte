<script lang="ts">
	import { page } from '$app/state';
	import { navSections } from './nav.js';

	let { onNavigate }: { onNavigate?: () => void } = $props();

	function isActive(href: string): boolean {
		const path = page.url.pathname;
		if (href === '/') return path === '/';
		const base = href.split('#')[0] ?? href;
		return path === base || path.startsWith(`${base}/`);
	}
</script>

<nav class="sidebar-nav" aria-label="Documentation">
	{#each navSections as section (section.title)}
		<div class="nav-section">
			<p class="nav-section-title">{section.title}</p>
			<ul>
				{#each section.items as item (item.href + item.label)}
					<li>
						<a
							href={item.href}
							class="nav-link"
							class:external={item.external}
							class:active={!item.external && isActive(item.href)}
							rel={item.external ? 'external' : undefined}
							aria-current={!item.external && isActive(item.href) ? 'page' : undefined}
							onclick={() => onNavigate?.()}
						>
							<span class="nav-label">{item.label}</span>
							{#if item.external}
								<span class="ext" aria-hidden="true">↗</span>
							{/if}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</nav>
