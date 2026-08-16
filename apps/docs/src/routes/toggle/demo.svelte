<script lang="ts">
	import { Toggle } from 'base-ui-svelte/toggle';
	import { ToggleGroup } from 'base-ui-svelte/toggle-group';
</script>

<h2>Sizes</h2>
<div class="row">
	<Toggle class="toggle toggle-sm" aria-label="Favorite small">★</Toggle>
	<Toggle class="toggle" aria-label="Favorite medium">★</Toggle>
	<Toggle class="toggle toggle-lg" aria-label="Favorite large">★</Toggle>
</div>

<h2>Toggle group</h2>
<ToggleGroup class="toggle-group" defaultValue={['left']} aria-label="Text alignment">
	<Toggle class="toggle" value="left" aria-label="Align left">L</Toggle>
	<Toggle class="toggle" value="center" aria-label="Align center">C</Toggle>
	<Toggle class="toggle" value="right" aria-label="Align right">R</Toggle>
</ToggleGroup>
