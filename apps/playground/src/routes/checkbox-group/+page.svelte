<script lang="ts">
	import { Checkbox } from 'base-ui-svelte/checkbox';
	import { CheckboxGroup } from 'base-ui-svelte/checkbox-group';
	import '../demo.css';
</script>

<h1>Checkbox Group</h1>
<div class="demo">
	<CheckboxGroup.Root class="stack" defaultValue={['fuji']} aria-label="Apples">
		<label class="field">
			<Checkbox.Root class="checkbox-sm" value="fuji" name="apple">
				<Checkbox.Indicator />
			</Checkbox.Root>
			Fuji
		</label>
		<label class="field">
			<Checkbox.Root class="checkbox-sm" value="gala" name="apple">
				<Checkbox.Indicator />
			</Checkbox.Root>
			Gala
		</label>
		<label class="field">
			<Checkbox.Root class="checkbox-sm" value="granny" name="apple">
				<Checkbox.Indicator />
			</Checkbox.Root>
			Granny Smith
		</label>
	</CheckboxGroup.Root>
</div>
