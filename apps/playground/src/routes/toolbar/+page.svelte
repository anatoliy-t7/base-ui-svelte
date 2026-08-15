<script lang="ts">
	import { Toolbar } from 'base-ui-svelte/toolbar';
	import '../demo.css';
</script>

<h1>Toolbar</h1>
<div class="demo">
	<Toolbar.Root class="toolbar" aria-label="Formatting">
		<Toolbar.Group aria-label="Style">
			<Toolbar.Button class="btn">Bold</Toolbar.Button>
			<Toolbar.Button class="btn">Italic</Toolbar.Button>
		</Toolbar.Group>
		<Toolbar.Separator />
		<Toolbar.Link class="btn" href="#docs">Docs</Toolbar.Link>
		<Toolbar.Separator />
		<Toolbar.Input class="field-input" placeholder="Find…" aria-label="Find" />
	</Toolbar.Root>
</div>
