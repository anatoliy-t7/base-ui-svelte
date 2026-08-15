<script lang="ts">
	import { Progress } from '../src/progress/index.js';
</script>

<Progress.Root value={40} data-testid="progress">
	<Progress.Label data-testid="label">Uploading</Progress.Label>
	<Progress.Track data-testid="track">
		<Progress.Indicator data-testid="indicator" />
	</Progress.Track>
	<Progress.Value data-testid="value" />
</Progress.Root>
