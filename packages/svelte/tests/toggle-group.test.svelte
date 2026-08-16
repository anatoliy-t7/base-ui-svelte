<script lang="ts">
	import { Toggle, ToggleGroup } from '../src/index.js';
</script>

<ToggleGroup data-testid="toggle-group" multiple={false}>
	<Toggle data-testid="toggle-a" value="a" aria-label="A">A</Toggle>
	<Toggle data-testid="toggle-b" value="b" aria-label="B">B</Toggle>
</ToggleGroup>
