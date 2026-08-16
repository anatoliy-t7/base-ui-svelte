<script lang="ts">
	import { Toolbar } from 'base-ui-svelte/toolbar';
</script>

<h1>Toolbar</h1>

<section class="demo">
	<Toolbar.Root class="toolbar" aria-label="Formatting">
		<Toolbar.Group class="toolbar-group" aria-label="Style">
			<Toolbar.Button class="toolbar-button">Bold</Toolbar.Button>
			<Toolbar.Button class="toolbar-button">Italic</Toolbar.Button>
		</Toolbar.Group>
		<Toolbar.Separator class="toolbar-separator" />
		<Toolbar.Link class="toolbar-button" href="#docs">Docs</Toolbar.Link>
		<Toolbar.Separator class="toolbar-separator" />
		<Toolbar.Input class="input input-sm" placeholder="Find…" aria-label="Find" />
	</Toolbar.Root>
</section>
