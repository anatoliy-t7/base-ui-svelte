<script lang="ts">
	import { Toggle } from '../src/index.js';

	let {
		pressed = undefined as boolean | undefined,
		defaultPressed = false,
		disabled = false,
		onPressedChange,
	}: {
		pressed?: boolean | undefined;
		defaultPressed?: boolean;
		disabled?: boolean;
		onPressedChange?: (pressed: boolean, event: Event) => void;
	} = $props();
</script>

<Toggle
	data-testid="toggle"
	aria-label="Bold"
	{pressed}
	{defaultPressed}
	{disabled}
	{onPressedChange}
>
	B
</Toggle>
