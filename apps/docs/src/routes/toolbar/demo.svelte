<script lang="ts">
	import { Toolbar } from 'base-ui-svelte/toolbar';
</script>

<Toolbar.Root class="toolbar" aria-label="Formatting">
	<Toolbar.Group class="toolbar-group" aria-label="Style">
		<Toolbar.Button class="toolbar-button" aria-label="Bold">
			<span class="font-semibold">B</span>
		</Toolbar.Button>
		<Toolbar.Button class="toolbar-button" aria-label="Italic">
			<span class="italic">I</span>
		</Toolbar.Button>
		<Toolbar.Button class="toolbar-button" aria-label="Underline">
			<span class="underline">U</span>
		</Toolbar.Button>
	</Toolbar.Group>
	<Toolbar.Separator class="toolbar-separator" />
	<Toolbar.Link class="toolbar-button" href="#docs">Docs</Toolbar.Link>
	<Toolbar.Separator class="toolbar-separator" />
	<Toolbar.Input class="input input-sm" placeholder="Find…" aria-label="Find" />
</Toolbar.Root>
