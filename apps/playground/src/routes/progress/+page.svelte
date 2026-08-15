<script lang="ts">
	import { Progress } from 'base-ui-svelte/progress';
	import '../demo.css';

	let value = $state(35);
</script>

<h1>Progress</h1>
<div class="demo">
	<Progress.Root class="progress" {value}>
		<Progress.Label>Export data</Progress.Label>
		<Progress.Value />
		<Progress.Track class="track">
			<Progress.Indicator class="indicator" />
		</Progress.Track>
	</Progress.Root>
	<button class="btn" onclick={() => (value = Math.min(100, value + 15))}>Advance</button>
</div>
