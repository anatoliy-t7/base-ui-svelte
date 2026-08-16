<script lang="ts">
	import { Switch } from '../src/index.js';

	let {
		checked = undefined as boolean | undefined,
		defaultChecked = false,
		disabled = false,
		onCheckedChange,
	}: {
		checked?: boolean | undefined;
		defaultChecked?: boolean;
		disabled?: boolean;
		onCheckedChange?: (checked: boolean, event: Event) => void;
	} = $props();
</script>

<Switch.Root
	data-testid="switch"
	aria-label="Airplane mode"
	{checked}
	{defaultChecked}
	{disabled}
	{onCheckedChange}
>
	<Switch.Thumb data-testid="thumb" />
</Switch.Root>
