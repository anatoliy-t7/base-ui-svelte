<script lang="ts">
	import { Checkbox } from 'base-ui-svelte/checkbox';
</script>

<h1>Checkbox</h1>

<section class="demo">
	<label class="checkbox-label">
		<Checkbox.Root class="checkbox">
			<Checkbox.Indicator class="checkbox-indicator" />
		</Checkbox.Root>
		Accept terms
	</label>

	<label class="checkbox-label">
		<Checkbox.Root class="checkbox" defaultChecked>
			<Checkbox.Indicator class="checkbox-indicator" />
		</Checkbox.Root>
		Checked by default
	</label>

	<label class="checkbox-label">
		<Checkbox.Root class="checkbox" disabled>
			<Checkbox.Indicator class="checkbox-indicator" />
		</Checkbox.Root>
		Disabled
	</label>
</section>
