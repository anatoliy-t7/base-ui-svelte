<script lang="ts">
	import { Radio } from 'base-ui-svelte/radio';
	import { RadioGroup } from 'base-ui-svelte/radio-group';
	import '../demo.css';
</script>

<h1>Radio</h1>
<div class="demo">
	<RadioGroup.Root class="stack" defaultValue="fuji" aria-label="Best apple">
		<label class="field">
			<Radio.Root class="radio" value="fuji">
				<Radio.Indicator />
			</Radio.Root>
			Fuji
		</label>
		<label class="field">
			<Radio.Root class="radio" value="gala">
				<Radio.Indicator />
			</Radio.Root>
			Gala
		</label>
		<label class="field">
			<Radio.Root class="radio" value="granny">
				<Radio.Indicator />
			</Radio.Root>
			Granny Smith
		</label>
	</RadioGroup.Root>
</div>
