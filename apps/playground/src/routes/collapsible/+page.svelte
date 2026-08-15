<script lang="ts">
	import { Collapsible } from 'base-ui-svelte/collapsible';
	import '../demo.css';
</script>

<h1>Collapsible</h1>
<div class="demo">
	<Collapsible.Root>
		<Collapsible.Trigger class="collapsible-trigger">Recovery keys</Collapsible.Trigger>
		<Collapsible.Panel class="collapsible-panel">
			<div>alien-bean-pasta</div>
			<div>wild-irish-burrito</div>
			<div>horse-battery-staple</div>
		</Collapsible.Panel>
	</Collapsible.Root>
</div>
