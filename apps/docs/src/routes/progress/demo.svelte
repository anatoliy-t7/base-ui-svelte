<script lang="ts">
	import { Progress } from 'base-ui-svelte/progress';
	let value = $state(35);
</script>

<Progress.Root class="progress" {value}>
	<Progress.Label class="progress-label">Export data</Progress.Label>
	<Progress.Value class="progress-value" />
	<Progress.Track class="progress-track">
		<Progress.Indicator class="progress-indicator" />
	</Progress.Track>
</Progress.Root>
<button class="btn" onclick={() => (value = Math.min(100, value + 15))}>Advance</button>
