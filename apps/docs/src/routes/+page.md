---
title: Quick start
description: Get started with base-ui-svelte. This site covers Svelte install, styles, and differences; upstream API detail lives on Base UI.
---

<script>
	import InstallationBlock from '$lib/InstallationBlock.svelte';
</script>

**base-ui-svelte** is an unofficial Svelte 5 port of [Base UI](https://base-ui.com). It is not affiliated with MUI or the Base UI team.

## Install the library

Install base-ui-svelte using a package manager.

<InstallationBlock />

All components are included in a single package. base-ui-svelte is tree-shakable, so your app bundle will contain only the components that you actually use.

Peer dependency: `svelte` `^5`.

Optional styles package: `@base-ui-svelte/styles` — see [Styling](/handbook/styling).

## Set up (portals)

Portaled overlays need the same stacking setup as Base UI. Follow [Base UI Quick start → Set up](https://base-ui.com/react/overview/quick-start) (`.root { isolation: isolate }` and `body { position: relative }` for iOS 26+ Safari). This docs app already applies those rules.

## Assemble a component

Import from `base-ui-svelte/<name>`, assemble parts, and style with `class` (not `className`):

```svelte
<script lang="ts">
	import { Popover } from 'base-ui-svelte/popover';
</script>

<Popover.Root>
	<Popover.Trigger class="btn">Notifications</Popover.Trigger>
	<Popover.Portal>
		<Popover.Positioner sideOffset={8}>
			<Popover.Popup class="popover-popup">
				<Popover.Title>Notifications</Popover.Title>
				<Popover.Description>You are all caught up.</Popover.Description>
			</Popover.Popup>
		</Popover.Positioner>
	</Popover.Portal>
</Popover.Root>
```

## Working with LLMs

Each docs page has a “View as Markdown” link at the top, which can be shared with AI chat assistants to help them understand base-ui-svelte concepts and component APIs.

There is also an [llms.txt](/llms.txt) link in the Handbook section of the navigation sidebar, which you can feed to AI chat assistants to help them navigate the docs.

## Next steps

- [Styling](/handbook/styling) — `data-*` hooks, CSS patterns, and optional `@base-ui-svelte/styles`
- [Differences](/handbook/differences) — Svelte adaptations vs Base UI React
- [Popover demo](/popover) and other components in the sidebar
