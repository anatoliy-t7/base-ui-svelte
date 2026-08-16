<script lang="ts">
	import { Checkbox } from 'base-ui-svelte/checkbox';
	import { CheckboxGroup } from 'base-ui-svelte/checkbox-group';
</script>

<h1>Checkbox Group</h1>

<section class="demo">
	<CheckboxGroup class="checkbox-group" defaultValue={['fuji']} aria-label="Apples">
		<span class="checkbox-group-label">Apples</span>
		<label class="checkbox-label">
			<Checkbox.Root class="checkbox" value="fuji" name="apple">
				<Checkbox.Indicator class="checkbox-indicator" />
			</Checkbox.Root>
			Fuji
		</label>
		<label class="checkbox-label">
			<Checkbox.Root class="checkbox" value="gala" name="apple">
				<Checkbox.Indicator class="checkbox-indicator" />
			</Checkbox.Root>
			Gala
		</label>
		<label class="checkbox-label">
			<Checkbox.Root class="checkbox" value="granny" name="apple">
				<Checkbox.Indicator class="checkbox-indicator" />
			</Checkbox.Root>
			Granny Smith
		</label>
	</CheckboxGroup>
</section>
