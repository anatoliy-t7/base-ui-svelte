<script lang="ts">
	import { Toggle } from 'base-ui-svelte/toggle';
	import { ToggleGroup } from 'base-ui-svelte/toggle-group';
	import '../demo.css';
</script>

<h1>Toggle</h1>
<div class="demo">
	<Toggle.Root class="toggle" aria-label="Favorite">★</Toggle.Root>

	<ToggleGroup.Root class="toggle-group" defaultValue={['left']} aria-label="Text alignment">
		<Toggle.Root class="toggle" value="left" aria-label="Align left">L</Toggle.Root>
		<Toggle.Root class="toggle" value="center" aria-label="Align center">C</Toggle.Root>
		<Toggle.Root class="toggle" value="right" aria-label="Align right">R</Toggle.Root>
	</ToggleGroup.Root>
</div>
