<script lang="ts">
	import { onMount } from 'svelte';
	import { Tabs } from 'base-ui-svelte/tabs';
	import { highlightCode } from './highlight.js';

	const MANAGERS = ['pnpm', 'npm', 'yarn', 'bun'] as const;
	type PackageManager = (typeof MANAGERS)[number];

	const STORAGE_KEY = 'preferredPackageManager';
	const DEFAULT_PACKAGES = ['base-ui-svelte'] as const;

	let {
		packages
	}: {
		packages?: readonly string[] | undefined;
	} = $props();

	const pkgList = $derived(packages ?? DEFAULT_PACKAGES);
	const commands = $derived({
		pnpm: `pnpm add ${pkgList.join(' ')}`,
		npm: `npm i ${pkgList.join(' ')}`,
		yarn: `yarn add ${pkgList.join(' ')}`,
		bun: `bun add ${pkgList.join(' ')}`
	} satisfies Record<PackageManager, string>);

	let manager = $state<PackageManager>('pnpm');
	let copied = $state(false);
	let copyTimer: number | undefined;

	const command = $derived(commands[manager]);

	function isManager(value: string): value is PackageManager {
		return (MANAGERS as readonly string[]).includes(value);
	}

	function persist(value: PackageManager): void {
		try {
			localStorage.setItem(STORAGE_KEY, value);
		} catch {
			// Ignore quota / private-mode failures.
		}
	}

	function onValueChange(value: string): void {
		if (!isManager(value)) return;
		manager = value;
		persist(value);
	}

	async function copy(): Promise<void> {
		try {
			await navigator.clipboard.writeText(command);
			copied = true;
			if (copyTimer !== undefined) window.clearTimeout(copyTimer);
			copyTimer = window.setTimeout(() => {
				copied = false;
			}, 1600);
		} catch {
			copied = false;
		}
	}

	onMount(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved && isManager(saved)) manager = saved;
		} catch {
			// Ignore unavailable storage.
		}

		return () => {
			if (copyTimer !== undefined) window.clearTimeout(copyTimer);
		};
	});
</script>

<div class="install">
	<Tabs.Root class="install-root" value={manager} {onValueChange}>
		<div class="install-bar">
			<Tabs.List class="install-list" aria-label="Package manager">
				{#each MANAGERS as item (item)}
					<Tabs.Tab class="install-tab" value={item}>{item}</Tabs.Tab>
				{/each}
			</Tabs.List>
			<button
				type="button"
				class="install-copy"
				aria-label={copied ? 'Copied' : 'Copy to clipboard'}
				title={copied ? 'Copied' : 'Copy'}
				onclick={copy}
			>
				{#if copied}
					<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
						<path
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M5 13l4 4L19 7"
						/>
					</svg>
				{:else}
					<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
						<rect
							x="9"
							y="9"
							width="13"
							height="13"
							rx="2"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						/>
						<path
							d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				{/if}
			</button>
		</div>

		{#each MANAGERS as item (item)}
			<Tabs.Panel class="install-panel" value={item}>
				{#if manager === item}
					{#await highlightCode(commands[item], 'bash')}
						<pre><code>{commands[item]}</code></pre>
					{:then highlighted}
						<div class="install-code">
							{@html highlighted}
						</div>
					{:catch}
						<pre><code>{commands[item]}</code></pre>
					{/await}
				{/if}
			</Tabs.Panel>
		{/each}
	</Tabs.Root>
	<p class="sr-only" role="status">{copied ? 'Copied to clipboard' : ''}</p>
</div>

<style>
	.install {
		margin: 1.25rem 0;
	}

	.install :global(.install-root) {
		border: 1px solid color-mix(in srgb, #fff 14%, #0d1117);
		border-radius: 0.55rem;
		overflow: hidden;
		background: #0d1117;
		color: #e8ecf1;
	}

	.install-bar {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.3rem 0.35rem 0.3rem 0.3rem;
		border-bottom: 1px solid color-mix(in srgb, #fff 10%, transparent);
		background: color-mix(in srgb, #fff 4%, #0d1117);
	}

	.install :global(.install-list) {
		display: flex;
		align-items: center;
		flex: 1;
		min-width: 0;
		gap: 0.1rem;
	}

	.install :global(.install-tab) {
		font: inherit;
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 0.78rem;
		font-weight: 500;
		line-height: 1;
		padding: 0.42rem 0.7rem;
		min-height: 1.85rem;
		border: 1px solid transparent;
		border-radius: 0.35rem;
		background: transparent;
		color: color-mix(in srgb, #e8ecf1 58%, transparent);
		cursor: pointer;
	}

	.install :global(.install-tab:hover:not([data-selected])) {
		color: #e8ecf1;
	}

	.install :global(.install-tab[data-selected]) {
		color: #e8ecf1;
		background: color-mix(in srgb, #fff 7%, transparent);
		border-color: color-mix(in srgb, #fff 16%, transparent);
	}

	.install-copy {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 2rem;
		height: 2rem;
		margin-inline-start: auto;
		padding: 0;
		border: 0;
		border-radius: 0.35rem;
		background: transparent;
		color: color-mix(in srgb, #e8ecf1 62%, transparent);
		cursor: pointer;
	}

	.install-copy:hover {
		color: #e8ecf1;
		background: color-mix(in srgb, #fff 8%, transparent);
	}

	.icon {
		width: 1rem;
		height: 1rem;
	}

	.install :global(.install-panel) {
		margin: 0;
	}

	.install :global(pre) {
		margin: 0;
		padding: 0.95rem 1.05rem;
		overflow-x: auto;
		border: 0;
		border-radius: 0;
		background: #0d1117;
		color: #e8ecf1;
		font-size: 0.84rem;
		line-height: 1.5;
		scrollbar-color: color-mix(in srgb, #fff 28%, transparent) transparent;
	}

	.install :global(pre code) {
		padding: 0;
		background: transparent;
		font-size: inherit;
		font-family: var(--font-mono, ui-monospace, monospace);
	}
</style>
