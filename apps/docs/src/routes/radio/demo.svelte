<script lang="ts">
	import { Radio } from 'base-ui-svelte/radio';
	import { RadioGroup } from 'base-ui-svelte/radio-group';
</script>

<RadioGroup class="radio-group" defaultValue="fuji" aria-label="Best apple">
	<span class="radio-group-label">Best apple</span>
	<label class="radio-label">
		<Radio.Root class="radio" value="fuji">
			<Radio.Indicator class="radio-indicator" />
		</Radio.Root>
		Fuji
	</label>
	<label class="radio-label">
		<Radio.Root class="radio" value="gala">
			<Radio.Indicator class="radio-indicator" />
		</Radio.Root>
		Gala
	</label>
	<label class="radio-label">
		<Radio.Root class="radio" value="granny">
			<Radio.Indicator class="radio-indicator" />
		</Radio.Root>
		Granny Smith
	</label>
	<label class="radio-label">
		<Radio.Root class="radio" value="honeycrisp" disabled>
			<Radio.Indicator class="radio-indicator" />
		</Radio.Root>
		Honeycrisp (disabled)
	</label>
</RadioGroup>
