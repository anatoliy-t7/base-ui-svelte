<script lang="ts">
	import { Input } from 'base-ui-svelte/input';
	import '../demo.css';

	let value = $state('Hello');
</script>

<h1>Input</h1>
<div class="demo">
	<label class="field">
		<span>Name</span>
		<Input.Root class="field-input" bind:value aria-label="Name" />
	</label>
	<p class="muted">Value: {value}</p>
</div>
