<script lang="ts">
	import { Meter } from '../src/meter/index.js';
</script>

<Meter.Root value={70} data-testid="meter">
	<Meter.Label data-testid="label">Storage</Meter.Label>
	<Meter.Track data-testid="track">
		<Meter.Indicator data-testid="indicator" />
	</Meter.Track>
	<Meter.Value data-testid="value" />
</Meter.Root>
