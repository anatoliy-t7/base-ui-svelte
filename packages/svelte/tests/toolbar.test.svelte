<script lang="ts">
	import { Toolbar } from '../src/toolbar/index.js';
</script>

<Toolbar.Root data-testid="toolbar" aria-label="Formatting">
	<Toolbar.Group>
		<Toolbar.Button data-testid="bold">Bold</Toolbar.Button>
		<Toolbar.Button data-testid="italic">Italic</Toolbar.Button>
	</Toolbar.Group>
	<Toolbar.Separator data-testid="separator" />
	<Toolbar.Link href="#link" data-testid="link">Link</Toolbar.Link>
	<Toolbar.Input data-testid="input" aria-label="Search" />
</Toolbar.Root>
