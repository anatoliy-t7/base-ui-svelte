<script lang="ts">
	import { Progress } from '../src/progress/index.js';

	let {
		value = 40 as number | null,
	}: {
		value?: number | null;
	} = $props();
</script>

<Progress.Root {value} data-testid="progress">
	<Progress.Label data-testid="label">Uploading</Progress.Label>
	<Progress.Track data-testid="track">
		<Progress.Indicator data-testid="indicator" />
	</Progress.Track>
	<Progress.Value data-testid="value" />
</Progress.Root>
