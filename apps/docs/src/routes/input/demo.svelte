<script lang="ts">
	import { Input } from 'base-ui-svelte/input';
	let value = $state('Hello');
</script>

<h2>Sizes</h2>
<div class="row">
	<Input class="input input-sm" placeholder="Small" aria-label="Small" />
	<Input class="input input-md" placeholder="Medium" aria-label="Medium" />
	<Input class="input input-lg" placeholder="Large" aria-label="Large" />
</div>

<h2>Interactive</h2>
<label class="field">
	<span class="field-label">Name</span>
	<Input class="input input-md" bind:value aria-label="Name" />
</label>
<p class="muted">Value: {value}</p>
