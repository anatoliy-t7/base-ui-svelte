<script lang="ts">
	import { Button } from '../src/button/index.js';

	let {
		disabled = false,
		focusableWhenDisabled = false
	}: {
		disabled?: boolean;
		focusableWhenDisabled?: boolean;
	} = $props();
</script>

<Button.Root
	data-testid="button"
	{disabled}
	{focusableWhenDisabled}
>
	Click me
</Button.Root>
