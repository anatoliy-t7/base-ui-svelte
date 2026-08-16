# Base UI Svelte

Unofficial Svelte 5 port of [Base UI](https://base-ui.com).

**This project is not affiliated with MUI or the Base UI team.** It reimplements Base UI–inspired APIs and accessibility behavior for Svelte 5.

## Install

```bash
bun add base-ui-svelte
# or
npm i base-ui-svelte
```

Peer dependency: `svelte` `^5`.

Optional styles package:

```bash
bun add @base-ui-svelte/styles tailwindcss
```

## Usage

```svelte
<script lang="ts">
	import { Dialog } from 'base-ui-svelte/dialog';
</script>

<Dialog.Root>
	<Dialog.Trigger>Open</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Backdrop />
		<Dialog.Popup>
			<!-- … -->
		</Dialog.Popup>
	</Dialog.Portal>
</Dialog.Root>
```

See the monorepo [README](../../README.md) and docs app for the full component list and handbook.

## Development

From the monorepo root:

```bash
bun install
bun run test
bun run build
bun run dev
```

## License

MIT
