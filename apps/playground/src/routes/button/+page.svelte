<script lang="ts">
	import { Button } from 'base-ui-svelte/button';
	import '../demo.css';
</script>

<h1>Button</h1>
<div class="demo">
	<Button.Root class="btn">Save</Button.Root>
	<Button.Root class="btn" disabled>Disabled</Button.Root>
	<Button.Root class="btn" disabled focusableWhenDisabled>Focusable when disabled</Button.Root>
</div>
