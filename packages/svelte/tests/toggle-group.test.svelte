<script lang="ts">
	import { Toggle, ToggleGroup } from '../src/index.js';
</script>

<ToggleGroup.Root data-testid="toggle-group" multiple={false}>
	<Toggle.Root data-testid="toggle-a" value="a" aria-label="A">A</Toggle.Root>
	<Toggle.Root data-testid="toggle-b" value="b" aria-label="B">B</Toggle.Root>
</ToggleGroup.Root>
